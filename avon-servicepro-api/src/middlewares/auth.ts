import { Request, Response, NextFunction } from 'express';
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
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    
    if (error || !supabaseUser) {
      logger.error(`Supabase getUser verification failed: ${error?.message || 'No user returned'}`);
      return next(new UnauthorizedError('Invalid or expired authentication token'));
    }

    // Explicit audience validation as part of JWT validation hardening
    if (supabaseUser.aud !== 'authenticated') {
      logger.warn(`Security warning: Unexpected audience '${supabaseUser.aud}' for user ${supabaseUser.id}`, { category: 'SECURITY' });
      return next(new UnauthorizedError('Token verification failed: invalid audience'));
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
    next();
  } catch (err) {
    logger.error(`Supabase authentication flow error: ${(err as Error).message}`);
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
      logger.warn(`RBAC violation: User ${req.user.name} with role ${userRole} tried to access forbidden resource ${req.originalUrl}`);
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
