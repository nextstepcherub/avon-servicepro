import { Request, Response, NextFunction } from 'express';

export function authenticateSupabase(req: Request, res: Response, next: NextFunction) {
  next();
}
