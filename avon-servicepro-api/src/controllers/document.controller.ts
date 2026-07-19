import { Request, Response } from 'express';
import { documentService } from '../services/document.service';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, UnauthorizedError } from '../utils/apiError';

export const getDocuments = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { category, associatedId, search } = req.query;

  const docs = await documentService.getDocuments({
    category: category as string,
    associatedId: associatedId as string,
    search: search as string,
    userRole: req.user.role,
    userId: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { documents: docs },
  });
});

export const getDocumentById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { id } = req.params;
  const doc = await documentService.getDocument(id, req.user.role);

  res.status(200).json({
    status: 'success',
    data: { document: doc },
  });
});

export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { name, description, category, associatedId, securityLevel, file } = req.body;

  if (!name || !category || !file || !file.originalName || !file.fileContent) {
    throw new BadRequestError('Missing required parameters: name, category, or file payload (originalName, fileContent)');
  }

  // Calculate file size if not provided
  const fileSize = file.fileSize || Math.round((file.fileContent.length * 3) / 4);

  const doc = await documentService.createDocument(
    {
      name,
      description,
      category,
      associatedId,
      ownerId: req.user.id,
      securityLevel,
    },
    {
      originalName: file.originalName,
      fileSize,
      mimeType: file.mimeType || 'application/octet-stream',
      fileContent: file.fileContent,
      uploadedBy: req.user.name,
      changeSummary: file.changeSummary,
    }
  );

  res.status(201).json({
    status: 'success',
    data: { document: doc },
  });
});

export const uploadNewVersion = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { id } = req.params;
  const { file } = req.body;

  if (!file || !file.originalName || !file.fileContent) {
    throw new BadRequestError('Missing required file payload (originalName, fileContent)');
  }

  const fileSize = file.fileSize || Math.round((file.fileContent.length * 3) / 4);

  const version = await documentService.addVersion(id, {
    originalName: file.originalName,
    fileSize,
    mimeType: file.mimeType || 'application/octet-stream',
    fileContent: file.fileContent,
    uploadedBy: req.user.name,
    changeSummary: file.changeSummary,
  });

  res.status(201).json({
    status: 'success',
    data: { version },
  });
});

export const downloadVersion = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { versionId } = req.params;
  const version = await documentService.getDocumentVersion(versionId, req.user.role);

  const buffer = Buffer.from(version.fileContent, 'base64');
  
  res.setHeader('Content-Type', version.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(version.originalName)}"`);
  res.send(buffer);
});

export const downloadLatest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { id } = req.params;
  const version = await documentService.getLatestVersion(id, req.user.role);

  const buffer = Buffer.from(version.fileContent, 'base64');
  
  res.setHeader('Content-Type', version.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(version.originalName)}"`);
  res.send(buffer);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User session is invalid');
  }

  const { id } = req.params;
  await documentService.deleteDocument(id, req.user.role, req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Document successfully archived/deleted',
  });
});
