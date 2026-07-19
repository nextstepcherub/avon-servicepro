import { Request, Response, NextFunction } from 'express';

export async function getDocuments(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function getDocumentById(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function uploadDocument(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function uploadNewVersion(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function downloadVersion(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Downloading version' });
}

export async function downloadLatest(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Downloading latest' });
}

export async function deleteDocument(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Document deleted' });
}
