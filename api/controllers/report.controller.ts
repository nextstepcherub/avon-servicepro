import { Request, Response, NextFunction } from 'express';

export async function getOperationalReport(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: {} });
}

export async function getKpiReport(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: {} });
}

export async function getExecutiveReport(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: {} });
}
