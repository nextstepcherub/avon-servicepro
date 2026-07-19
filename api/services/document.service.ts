import { v4 as uuidv4 } from 'uuid';

export class DocumentService {
  private documents: any[] = [];

  async createDocument(meta: any, file: any) {
    const id = uuidv4();
    const doc = {
      id,
      ...meta,
      createdAt: new Date().toISOString(),
      latestVersion: {
        id: uuidv4(),
        versionNumber: 1,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        changeSummary: file.changeSummary,
        uploadedAt: new Date().toISOString(),
        uploadedBy: file.uploadedBy,
      },
      versions: []
    };
    doc.versions.push(doc.latestVersion);
    this.documents.push(doc);
    return doc;
  }

  async getDocuments(filter: { category?: string; userRole?: string; userId?: string }) {
    return this.documents.filter(doc => {
      if (filter.category && doc.category !== filter.category) {
        return false;
      }
      if (doc.securityLevel === 'INTERNAL_ONLY' && filter.userRole !== 'Admin') {
        return false;
      }
      return true;
    });
  }

  async addVersion(docId: string, file: any) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    const nextVersionNumber = doc.versions.length + 1;
    const newVersion = {
      id: uuidv4(),
      versionNumber: nextVersionNumber,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      changeSummary: file.changeSummary,
      uploadedAt: new Date().toISOString(),
      uploadedBy: file.uploadedBy,
    };

    doc.versions.push(newVersion);
    doc.latestVersion = newVersion;
    return newVersion;
  }
}

export const documentService = new DocumentService();
