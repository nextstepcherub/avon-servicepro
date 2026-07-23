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
  let stack: string | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    message = err.message || message;
  }

  if (config.nodeEnv === 'development') {
    stack = err.stack;
  }

  // Log error using our winston logger
  logger.error(`${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);
  if (stack) {
    logger.debug(`Stack trace:\n${stack}`);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(stack && { stack }),
  });
};
