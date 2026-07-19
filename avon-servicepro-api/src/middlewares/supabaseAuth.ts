import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { createSupabaseContext } from '@supabase/server';
import { UnauthorizedError } from '../utils/apiError';
import { logger } from '../config/logger';

// Extend Express Request to support Supabase Context
declare global {
  namespace Express {
    interface Request {
      supabaseContext?: {
        supabase: any;
        supabaseAdmin: any;
        userClaims: any;
        jwtClaims: any;
        authMode: string;
      };
    }
  }
}

/**
 * Express middleware to authenticate requests using @supabase/server.
 * It extracts and verifies the JWT token, then injects a user-scoped client,
 * admin client, and user claims onto the request.
 */
export async function authenticateSupabase(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  // Construct a standard Web API Request from the Express request object
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const url = `${protocol}://${req.headers.host || 'localhost'}${req.originalUrl}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        headers.append(key, v);
      }
    } else if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  const webRequest = new Request(url, {
    method: req.method,
    headers,
  });

  try {
    // Call @supabase/server to create the context and verify JWT
    const { data: ctx, error } = await createSupabaseContext(webRequest, {
      auth: 'user',
    });

    if (error) {
      logger.error(`Supabase Auth failed: ${error.message} (code: ${error.code})`);
      return next(new UnauthorizedError(`Supabase authentication failed: ${error.message}`));
    }

    if (!ctx) {
      return next(new UnauthorizedError('No authentication context returned'));
    }

    // Inject Supabase Context into Express Request
    req.supabaseContext = {
      supabase: ctx.supabase,
      supabaseAdmin: ctx.supabaseAdmin,
      userClaims: ctx.userClaims,
      jwtClaims: ctx.jwtClaims,
      authMode: ctx.authMode,
    };

    logger.debug(`Supabase user verified successfully: ${ctx.userClaims?.email || 'Unknown User'}`);
    next();
  } catch (err: any) {
    logger.error(`Supabase auth middleware error: ${err.message}`);
    return next(new UnauthorizedError('Invalid or expired Supabase authentication token'));
  }
}
