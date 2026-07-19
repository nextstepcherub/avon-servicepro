import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
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

// Extend Express Request interface to include user and sessionUser
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      sessionUser?: Omit<UserEntity, 'passwordHash'>;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth failed: Missing or invalid authorization header on ${req.originalUrl}`);
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;
    req.user = decoded;
    logger.debug(`User authenticated successfully: ${decoded.name} (${decoded.role})`);
    next();
  } catch (err) {
    logger.error(`JWT Verification failed: ${(err as Error).message}`);
    return next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Session check failed: Missing or invalid authorization header on ${req.originalUrl}`);
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;
    req.user = decoded;

    // Load user from database to ensure they exist and have latest roles/tags
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      logger.warn(`Session check failed: User ${decoded.id} not found in database`);
      return next(new UnauthorizedError('User profile not found. Session invalid.'));
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    req.sessionUser = userWithoutPassword;

    // Sync req.user with latest DB state
    const tagsArray = JSON.parse(user.tags) as string[];
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tags: tagsArray,
    };

    logger.debug(`Session validated via DB for user: ${user.name} (${user.role})`);
    next();
  } catch (err) {
    logger.error(`Session JWT Verification failed: ${(err as Error).message}`);
    return next(new UnauthorizedError('Invalid or expired session token'));
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    const userRole = req.user.role;

    // System Admins always bypass checks
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

    // System Admins always bypass checks
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
