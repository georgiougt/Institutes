import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Split pathname to analyze segments
  const segments = pathname.split('/');
  const rootSegment = segments[1];

  // List of valid root segments that shouldn't be prefixed with /cy
  const validRootSegments = new Set([
    'cy',
    'gr',
    'admin',
    'owner',
    'login',
    'reset-password',
    'forgot-password',
    'onboard',
    'institute',
    'sitemap.xml',
    'robots.txt',
  ]);

  // 1. Root level redirect or /gr redirect (force cy until Greece is launched)
  if (pathname === '/' || pathname === '/gr' || pathname.startsWith('/gr/')) {
    let newPath = pathname;
    if (pathname === '/' || pathname === '/gr') {
      newPath = '/cy';
    } else {
      newPath = pathname.replace(/^\/gr\//i, '/cy/');
    }
    const url = new URL(newPath + search, request.url);
    return NextResponse.redirect(url, 301);
  }

  // 2. Protect admin routes
  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('auth_role')?.value;

    if (role !== 'ADMIN') {
      // Redirect to login if not an admin
      const url = new URL('/login' + search, request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. Redirect invalid country routes (e.g. /search, /contact, or /search/institute/...)
  if (rootSegment && !validRootSegments.has(rootSegment)) {
    // If the path looks like /[dummy]/institute/[id]
    // redirect directly to the canonical /cy/institute/[id]
    if (segments[2] === 'institute' && segments[3]) {
      const remainingPath = segments.slice(3).join('/');
      const url = new URL(`/cy/institute/${remainingPath}${search}`, request.url);
      return NextResponse.redirect(url, 301);
    }

    // Otherwise, prepend /cy to the path
    const url = new URL(`/cy${pathname}${search}`, request.url);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Match all requests except static files, assets, API routes, and favicon
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|subjects|.*\\.png$|.*\\.gif$|.*\\.webp$|.*\\.svg$).*)',
  ],
};
