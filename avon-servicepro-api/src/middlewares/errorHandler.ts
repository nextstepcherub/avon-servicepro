import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../config/logger';
import { config } from '../config/environment';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: any = null;
  let stack: string | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || code;
    details = err.details ?? null;
  } else {
    message = err.message || message;
    if ((err as any).code && typeof (err as any).code === 'string') {
      code = (err as any).code;
    }
  }

  if (config.nodeEnv === 'development') {
    stack = err.stack;
  }

  // Log error using our winston logger
  logger.error(`${req.method} ${req.originalUrl} - Status: ${statusCode} - Code: ${code} - Message: ${message}`);
  if (stack) {
    logger.debug(`Stack trace:\n${stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    details,
    ...(stack && { stack }),
  });
};

