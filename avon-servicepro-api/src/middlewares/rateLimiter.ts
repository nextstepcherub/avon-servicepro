import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/apiError';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction) => {
    logger.security(`Global rate limit exceeded by IP ${req.ip} on ${req.originalUrl}`, { ip: req.ip, path: req.originalUrl });
    next(new ApiError(429, 'Too many requests from this IP. Please try again after 15 minutes.', 'RATE_LIMIT_EXCEEDED'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    logger.security(`Auth rate limit exceeded by IP ${req.ip} on ${req.originalUrl}`, { ip: req.ip, path: req.originalUrl });
    next(new ApiError(429, 'Too many authentication attempts. Please try again after 15 minutes.', 'RATE_LIMIT_EXCEEDED'));
  },
});

export const sensitiveOpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    logger.security(`Sensitive operation rate limit exceeded by IP ${req.ip} on ${req.originalUrl}`, { ip: req.ip, path: req.originalUrl });
    next(new ApiError(429, 'Too many mutation requests. Rate limit exceeded.', 'RATE_LIMIT_EXCEEDED'));
  },
});

