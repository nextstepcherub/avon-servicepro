import { dbPool } from '../config/database';
import { uuidHelper } from '../utils/uuid';
import { GenericCrudRepository } from './base.repository';

export interface DocumentEntity {
  id: string;
  name: string;
  description?: string;
  category: string;
  associatedId?: string;
  ownerId: string;
  securityLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersionEntity {
  id: string;
  documentId: string;
  versionNumber: number;
  originalName: string;
  fileSize: number;
  mimeType: string;
  fileContent: string; // base64 string
  uploadedBy: string;
  uploadedAt: string;
  changeSummary?: string;
}

export class DocumentRepository extends GenericCrudRepository<DocumentEntity> {
  constructor() {
    super('documents', [
      'id', 'name', 'description', 'category', 'associatedId', 'ownerId', 'securityLevel', 'status', 'createdAt', 'updatedAt'
    ]);
  }
}

export class DocumentVersionRepository extends GenericCrudRepository<DocumentVersionEntity> {
  constructor() {
    super('document_versions', [
      'id', 'documentId', 'versionNumber', 'originalName', 'fileSize', 'mimeType', 'fileContent', 'uploadedBy', 'uploadedAt', 'changeSummary'
    ]);
  }

  async findLatestByDocumentId(documentId: string): Promise<DocumentVersionEntity | null> {
    const sql = `SELECT * FROM document_versions WHERE documentId = ? ORDER BY versionNumber DESC LIMIT 1`;
    const rows = await dbPool.query(sql, [documentId]);
    if (rows.length === 0) return null;
    return rows[0] as DocumentVersionEntity;
  }

  async findByDocumentId(documentId: string): Promise<Omit<DocumentVersionEntity, 'fileContent'>[]> {
    const sql = `SELECT id, documentId, versionNumber, originalName, fileSize, mimeType, uploadedBy, uploadedAt, changeSummary FROM document_versions WHERE documentId = ? ORDER BY versionNumber DESC`;
    const rows = await dbPool.query(sql, [documentId]);
    return rows as Omit<DocumentVersionEntity, 'fileContent'>[];
  }
}

export const documentRepository = new DocumentRepository();
export const documentVersionRepository = new DocumentVersionRepository();
