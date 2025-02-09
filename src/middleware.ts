import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axiosInstance from './app/_lib/axios';

export async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const method = req.method;

  const isLoggedIn = await isUserLoggedIn();
  if (currentPath.startsWith('/dashboard')) {
    if (!isLoggedIn && method === 'GET') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else if (currentPath === '/') {
    if (isLoggedIn && method === 'GET') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

async function isUserLoggedIn() {
  try {
    await axiosInstance.get('/is_logged_in');
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
