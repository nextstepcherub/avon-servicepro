import { documentRepository, documentVersionRepository, DocumentEntity, DocumentVersionEntity } from '../repositories/document.repository';
import { dbPool } from '../config/database';
import { uuidHelper } from '../utils/uuid';
import { logger } from '../config/logger';
import { ForbiddenError, NotFoundError } from '../utils/apiError';

export class DocumentService {
  async createDocument(
    doc: {
      name: string;
      description?: string;
      category: string;
      associatedId?: string;
      ownerId: string;
      securityLevel?: string;
    },
    file: {
      originalName: string;
      fileSize: number;
      mimeType: string;
      fileContent: string;
      uploadedBy: string;
      changeSummary?: string;
    }
  ): Promise<DocumentEntity & { latestVersion: Omit<DocumentVersionEntity, 'fileContent'> }> {
    const docId = uuidHelper.generate();
    const verId = uuidHelper.generate();
    const now = new Date().toISOString();

    const docEntity: DocumentEntity = {
      id: docId,
      name: doc.name,
      description: doc.description || '',
      category: doc.category,
      associatedId: doc.associatedId || undefined,
      ownerId: doc.ownerId,
      securityLevel: doc.securityLevel || 'STANDARD',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const verEntity: DocumentVersionEntity = {
      id: verId,
      documentId: docId,
      versionNumber: 1,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      fileContent: file.fileContent,
      uploadedBy: file.uploadedBy,
      uploadedAt: now,
      changeSummary: file.changeSummary || 'Initial Upload',
    };

    logger.info(`Creating document: ${doc.name} with ID: ${docId}`);
    
    // Create document & its first version
    await documentRepository.create(docEntity);
    await documentVersionRepository.create(verEntity);

    const { fileContent: _, ...verWithoutContent } = verEntity;

    return {
      ...docEntity,
      latestVersion: verWithoutContent,
    };
  }

  async addVersion(
    documentId: string,
    file: {
      originalName: string;
      fileSize: number;
      mimeType: string;
      fileContent: string;
      uploadedBy: string;
      changeSummary?: string;
    }
  ): Promise<Omit<DocumentVersionEntity, 'fileContent'>> {
    uuidHelper.assertValid(documentId);
    
    const doc = await documentRepository.findById(documentId);
    if (!doc) {
      throw new NotFoundError('Document not found');
    }

    const latestVer = await documentVersionRepository.findLatestByDocumentId(documentId);
    const nextVerNumber = latestVer ? latestVer.versionNumber + 1 : 1;
    const verId = uuidHelper.generate();
    const now = new Date().toISOString();

    const verEntity: DocumentVersionEntity = {
      id: verId,
      documentId,
      versionNumber: nextVerNumber,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      fileContent: file.fileContent,
      uploadedBy: file.uploadedBy,
      uploadedAt: now,
      changeSummary: file.changeSummary || `Version ${nextVerNumber} uploaded`,
    };

    logger.info(`Adding version ${nextVerNumber} to document ID: ${documentId}`);
    await documentVersionRepository.create(verEntity);

    // Update document updatedAt timestamp
    await documentRepository.update(documentId, { updatedAt: now });

    const { fileContent: _, ...verWithoutContent } = verEntity;
    return verWithoutContent;
  }

  async getDocuments(filters: {
    category?: string;
    associatedId?: string;
    search?: string;
    userRole: string;
    userId: string;
  }): Promise<any[]> {
    // 1. Build standard SQL search or fallback mock search
    let sql = `SELECT * FROM documents WHERE status = 'ACTIVE'`;
    const params: any[] = [];

    if (filters.category && filters.category !== 'ALL') {
      sql += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.associatedId) {
      sql += ` AND associatedId = ?`;
      params.push(filters.associatedId);
    }

    if (filters.search) {
      sql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Apply role-based filtering:
    // - Customer can only see STANDARD security level
    // - Technician can see STANDARD and INTERNAL_ONLY
    // - Admin, System Admin, Dispatcher can see everything (STANDARD, INTERNAL_ONLY, CONFIDENTIAL)
    if (filters.userRole === 'Customer') {
      sql += ` AND securityLevel = 'STANDARD'`;
    } else if (filters.userRole === 'Technician') {
      sql += ` AND securityLevel IN ('STANDARD', 'INTERNAL_ONLY')`;
    }

    const docs = await dbPool.query(sql, params) as DocumentEntity[];
    
    // 2. Fetch latest version info for each document
    const results = [];
    for (const doc of docs) {
      const latestVer = await documentVersionRepository.findLatestByDocumentId(doc.id);
      results.push({
        ...doc,
        fileSize: latestVer ? latestVer.fileSize : 0,
        mimeType: latestVer ? latestVer.mimeType : 'application/octet-stream',
        originalName: latestVer ? latestVer.originalName : '',
        versionNumber: latestVer ? latestVer.versionNumber : 1,
        uploadedBy: latestVer ? latestVer.uploadedBy : '',
        uploadedAt: latestVer ? latestVer.uploadedAt : doc.createdAt,
      });
    }

    // Sort by updatedAt DESC
    return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getDocument(id: string, userRole: string): Promise<any> {
    uuidHelper.assertValid(id);
    const doc = await documentRepository.findById(id);
    if (!doc || doc.status === 'DELETED') {
      throw new NotFoundError('Document not found');
    }

    // Security Check
    this.assertSecurityAccess(doc, userRole);

    const versions = await documentVersionRepository.findByDocumentId(id);
    return {
      ...doc,
      versions,
    };
  }

  async getDocumentVersion(versionId: string, userRole: string): Promise<DocumentVersionEntity> {
    uuidHelper.assertValid(versionId);
    const version = await documentVersionRepository.findById(versionId);
    if (!version) {
      throw new NotFoundError('Document version not found');
    }

    const doc = await documentRepository.findById(version.documentId);
    if (!doc || doc.status === 'DELETED') {
      throw new NotFoundError('Document has been deleted');
    }

    // Security Check
    this.assertSecurityAccess(doc, userRole);

    return version;
  }

  async getLatestVersion(documentId: string, userRole: string): Promise<DocumentVersionEntity> {
    uuidHelper.assertValid(documentId);
    const doc = await documentRepository.findById(documentId);
    if (!doc || doc.status === 'DELETED') {
      throw new NotFoundError('Document not found');
    }

    // Security Check
    this.assertSecurityAccess(doc, userRole);

    const latest = await documentVersionRepository.findLatestByDocumentId(documentId);
    if (!latest) {
      throw new NotFoundError('No versions found for this document');
    }

    return latest;
  }

  async deleteDocument(id: string, userRole: string, userId: string): Promise<boolean> {
    uuidHelper.assertValid(id);
    const doc = await documentRepository.findById(id);
    if (!doc) {
      throw new NotFoundError('Document not found');
    }

    // Only owners or Admins/Dispatchers can delete
    if (doc.ownerId !== userId && !['System Admin', 'Admin', 'Dispatcher'].includes(userRole)) {
      throw new ForbiddenError('You do not have permission to delete this document');
    }

    // Soft delete document
    await documentRepository.update(id, { status: 'DELETED' });
    logger.info(`Soft deleted document ID: ${id}`);
    return true;
  }

  private assertSecurityAccess(doc: DocumentEntity, userRole: string) {
    if (doc.securityLevel === 'CONFIDENTIAL') {
      if (!['System Admin', 'Admin', 'Dispatcher'].includes(userRole)) {
        throw new ForbiddenError('You do not have access to this confidential document');
      }
    } else if (doc.securityLevel === 'INTERNAL_ONLY') {
      if (userRole === 'Customer') {
        throw new ForbiddenError('This document is internal-only and not available to customer roles');
      }
    }
  }
}

export const documentService = new DocumentService();
