import { Request, Response, NextFunction } from 'express';

export async function getUsersList(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function getUserDetail(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function createAdminUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function updateAdminUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function deleteAdminUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'User deleted' });
}

export async function getPermissionsList(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function createPermission(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function deletePermission(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Permission deleted' });
}

export async function getRolesList(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function assignPermissionToRole(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Permission assigned' });
}

export async function revokePermissionFromRole(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Permission revoked' });
}
