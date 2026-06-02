import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Root level redirect or /gr redirect (force cy until Greece is launched)
  if (pathname === '/' || pathname === '/gr' || pathname.startsWith('/gr/')) {
    let newPath = pathname;
    if (pathname === '/' || pathname === '/gr') {
      newPath = '/cy';
    } else {
      newPath = pathname.replace(/^\/gr\//i, '/cy/');
    }
    const url = new URL(newPath, request.url);
    return NextResponse.redirect(url);
  }

  // 2. Protect admin routes
  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('auth_role')?.value;

    if (role !== 'ADMIN') {
      // Redirect to login if not an admin
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Ensure middleware runs on root, admin, and /gr routes
export const config = {
  matcher: ['/', '/gr', '/gr/:path*', '/admin/:path*'],
};
