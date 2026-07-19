import { Request, Response, NextFunction } from 'express';

export async function createOrgUnit(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function getOrgUnitById(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function listOrgUnits(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function updateOrgUnit(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function deleteOrgUnit(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Org unit deleted' });
}

export async function getOrgTree(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: {} });
}
