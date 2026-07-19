// ============================================================================
// File: src/middleware.ts (Next.js 16 App Router Middleware Export)
// Sprint 1.2 Authentication Guard
// ============================================================================

import { checkProtectedMiddleware } from './middleware/protectedGuard';

export function middleware(request: any) {
  const pathname = request?.nextUrl?.pathname || '/';
  const guard = checkProtectedMiddleware(pathname);

  if (!guard.allowed && guard.redirectTo) {
    // In Next.js: return NextResponse.redirect(new URL(guard.redirectTo, request.url));
    return { status: 307, redirect: guard.redirectTo };
  }

  return { status: 200 };
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
