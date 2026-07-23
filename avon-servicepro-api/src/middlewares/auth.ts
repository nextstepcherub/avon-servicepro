import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { UnauthorizedError, ForbiddenError } from '../utils/apiError';
import { logger } from '../config/logger';
import { userRepository, UserEntity } from '../repositories/user.repository';
import { rbacRepository } from '../repositories/rbac.repository';

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      sessionUser?: Omit<UserEntity, 'passwordHash'>;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth failed: Missing or invalid authorization header on ${req.originalUrl}`);
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. JWT Payload Claims Validation (Audience, Issuer & Expiration)
    const decodedPayload = jwt.decode(token) as jwt.JwtPayload | null;
    if (decodedPayload) {
      // Expiration check
      if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
        logger.security(`Auth check failed: Token expired on ${req.originalUrl}`, { ip: req.ip, url: req.originalUrl });
        return next(new UnauthorizedError('Authentication token has expired'));
      }

      // Audience Validation
      const expectedAud = process.env.JWT_AUDIENCE || 'authenticated';
      if (decodedPayload.aud) {
        const isAudValid = Array.isArray(decodedPayload.aud)
          ? decodedPayload.aud.includes(expectedAud)
          : decodedPayload.aud === expectedAud;

        if (!isAudValid) {
          logger.security(`Auth check failed: JWT audience mismatch. Received: ${JSON.stringify(decodedPayload.aud)}, Expected: ${expectedAud}`, { ip: req.ip });
          return next(new UnauthorizedError('Invalid JWT token audience'));
        }
      }

      // Issuer Validation
      const expectedIss = process.env.JWT_ISSUER || (process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/auth/v1` : undefined);
      if (expectedIss && decodedPayload.iss && decodedPayload.iss !== expectedIss) {
        logger.security(`Auth check failed: JWT issuer mismatch. Received: ${decodedPayload.iss}, Expected: ${expectedIss}`, { ip: req.ip });
        return next(new UnauthorizedError('Invalid JWT token issuer'));
      }
    }

    // 2. Token cryptographic verification via Supabase Auth client if initialized
    if (supabase) {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !supabaseUser) {
        logger.error(`Supabase getUser verification failed: ${error?.message || 'No user returned'}`);
        return next(new UnauthorizedError('Invalid or expired authentication token'));
      }

      const user = await userRepository.findById(supabaseUser.id);
      if (!user) {
        logger.warn(`Auth check failed: User ${supabaseUser.id} not found in database`);
        return next(new UnauthorizedError('User profile not found. Session invalid.'));
      }

      req.sessionUser = user;

      const tagsArray = JSON.parse(user.tags || '[]') as string[];
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tags: tagsArray,
      };

      logger.debug(`User authenticated successfully via Supabase: ${user.name} (${user.role})`);
      return next();
    }

    // Fallback authentication if Supabase is offline/mock
    if (decodedPayload && decodedPayload.sub) {
      const user = await userRepository.findById(decodedPayload.sub);
      if (user) {
        req.sessionUser = user;
        const tagsArray = JSON.parse(user.tags || '[]') as string[];
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tags: tagsArray,
        };
        return next();
      }
    }

    return next(new UnauthorizedError('Invalid or expired authentication token'));
  } catch (err) {
    logger.error(`Authentication flow error: ${(err as Error).message}`);
    return next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    const userRole = req.user.role;

    if (userRole === 'System Admin') {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      logger.security(`RBAC violation: User ${req.user.name} with role ${userRole} tried to access forbidden resource ${req.originalUrl}`, { userId: req.user.id, role: userRole, url: req.originalUrl });
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};

export const requireRole = (allowedRoles: string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    const userRole = req.user.role;

    if (userRole === 'System Admin') {
      return next();
    }

    if (!roles.includes(userRole)) {
      logger.warn(`RBAC Role violation: User ${req.user.name} with role ${userRole} tried to access resource ${req.originalUrl}, required roles: [${roles.join(', ')}]`);
      return next(new ForbiddenError('You do not have the required role to perform this action'));
    }

    next();
  };
};

export const requirePermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    const userRole = req.user.role;
    const hasPermission = await rbacRepository.checkPermission(userRole, permissionCode);

    if (!hasPermission) {
      logger.warn(`RBAC Permission violation: User ${req.user.name} with role ${userRole} lacks permission '${permissionCode}' for ${req.originalUrl}`);
      return next(new ForbiddenError(`You do not have the required permission: '${permissionCode}'`));
    }

    next();
  };
};
