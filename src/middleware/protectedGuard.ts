// ============================================================================
// File: src/middleware/protectedGuard.ts
// Sprint 1.2 Protected Route Middleware & Guard Logic
// Unauthenticated users redirect to /auth/login
// Authenticated users allow access
// ============================================================================

import { safeLocalStorage } from '../lib/safeStorage';

export interface RouteGuardResult {
  allowed: boolean;
  redirectTo?: string;
  sessionEmail?: string;
}

/**
 * Requirement 2: Protected Middleware logic
 * Checks active authentication token/cookie.
 * If unauthenticated -> redirects to /auth/login
 * If authenticated -> allows access
 */
export function checkProtectedMiddleware(currentPath?: string): RouteGuardResult {
  const sessionToken = safeLocalStorage.getItem('avon_auth_session');

  // If path is already auth login, allow if unauthenticated
  if (currentPath === '/auth/login' || currentPath === 'login') {
    if (sessionToken) {
      return { allowed: false, redirectTo: '/dashboard', sessionEmail: sessionToken };
    }
    return { allowed: true };
  }

  // Protected Route Check
  if (!sessionToken) {
    return {
      allowed: false,
      redirectTo: '/auth/login'
    };
  }

  return {
    allowed: true,
    sessionEmail: sessionToken
  };
}

/**
 * Next.js 16 SSR Middleware Simulation Pattern
 * In a standalone Next.js App Router project, this is exported as middleware(request: NextRequest)
 */
export async function nextMiddlewareSimulation(request: any) {
  const url = request.nextUrl || { pathname: '/' };
  const authCookie = request.cookies?.get('avon_auth_session');

  if (!authCookie && !url.pathname.startsWith('/auth')) {
    return { status: 307, headers: { Location: '/auth/login' } };
  }

  return { status: 200 };
}
