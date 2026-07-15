import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow login page
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Check for session cookie (supports both local and production Vercel environments)
  const sessionToken = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token') || request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
  
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static files, _next internals, and API auth routes
  matcher: ["/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)).*)"],
};
