import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`Error in request ${req.method} ${req.originalUrl}:`, err);
  
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}
