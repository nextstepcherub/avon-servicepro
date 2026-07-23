import cors, { CorsOptions } from 'cors';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/apiError';

// CORS Whitelist Configuration
const rawAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS || '';
const customOrigins = rawAllowedOrigins.split(',').map((o) => o.trim()).filter(Boolean);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  // Allow requests with no origin (like mobile apps, curl, server-to-server)
  if (!origin) return true;

  // Check custom allowed origins from env
  if (customOrigins.includes(origin) || customOrigins.includes('*')) {
    return true;
  }

  // Allow localhost / local IP development origins
  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(origin)) {
    return true;
  }

  // Allow Cloud Run / AI Studio preview domain patterns
  if (/\.run\.app$/.test(origin) || /\.google\.com$/.test(origin)) {
    return true;
  }

  return false;
};

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      logger.security(`CORS Security Violation: Origin '${origin}' blocked by whitelist policy.`, { origin });
      callback(new Error(`CORS policy blocks access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Correlation-ID'],
  exposedHeaders: ['X-Total-Count', 'Content-Range'],
  maxAge: 86400, // Preflight cache for 24 hours
};

export const corsMiddleware = cors(corsOptions);

// Custom Security Headers Middleware
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

// Request Payload Size Error Handler
export const payloadSizeErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    logger.security(`Request size limit exceeded on ${req.method} ${req.originalUrl}`, { ip: req.ip, method: req.method, url: req.originalUrl });
    return next(new ApiError(413, 'Request payload too large. Maximum allowed size is 10MB.', 'PAYLOAD_TOO_LARGE'));
  }
  next(err);
};

