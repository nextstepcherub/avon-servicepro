import { Request, Response, NextFunction } from 'express';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', token: 'mock_token', user: { email: req.body.email } });
}

export async function impersonateUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', token: 'mock_impersonated_token' });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: { id: 'usr_sys_admin', name: 'System Admin', email: 'administrator@avon.lk' } });
}

export async function logoutUser(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Logged out successfully' });
}

export async function refreshSessionToken(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', token: 'refreshed_mock_token' });
}
