import { Request, Response, NextFunction } from 'express';

// Mock auth middleware for Avon ServicePro Enterprise API
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Attach a mock user for testing/development fallback
  (req as any).user = {
    id: 'usr_sys_admin',
    name: 'System Admin',
    email: 'administrator@avon.lk',
    role: 'System Admin',
    permissions: ['*']
  };
  next();
}

export function requireRole(roles: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

export function authorize(arg?: any, res?: Response, next?: NextFunction) {
  if (typeof arg === 'function' || (arg && res && next)) {
    if (next) next();
  } else {
    return (req: Request, response: Response, nextFn: NextFunction) => {
      nextFn();
    };
  }
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  next();
}
