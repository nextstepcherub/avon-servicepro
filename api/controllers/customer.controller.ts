import { Request, Response, NextFunction } from 'express';

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: null });
}

export async function listCustomers(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: [] });
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', data: req.body });
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'success', message: 'Customer deleted' });
}
