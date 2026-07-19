import { Request, Response, NextFunction } from 'express';

export async function registerAsset(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function getAssetById(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function listAssets(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function updateAsset(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function deleteAsset(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Asset deleted' });
}
