import { Request, Response, NextFunction } from 'express';

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}
