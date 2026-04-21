import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
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

// Ensure middleware runs on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
