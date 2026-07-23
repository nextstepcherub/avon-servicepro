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
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let stack: string | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    // Map status codes to standardized error string codes
    switch (statusCode) {
      case 400:
        errorCode = 'BAD_REQUEST';
        break;
      case 401:
        errorCode = 'UNAUTHORIZED';
        break;
      case 403:
        errorCode = 'FORBIDDEN';
        break;
      case 404:
        errorCode = 'NOT_FOUND';
        break;
      default:
        errorCode = 'SERVER_ERROR';
    }
  } else {
    message = err.message || message;
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
    }
  }

  if (config.nodeEnv === 'development') {
    stack = err.stack;
  }

  // Log error using our winston logger
  logger.error(`${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`, { category: 'ERROR' });
  if (stack) {
    logger.debug(`Stack trace:\n${stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code: errorCode,
    details: stack ? { stack } : null,
  });
};
