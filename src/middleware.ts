export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { baseUrl } from './app/_lib/utils';

const pathWithoutAuth = ['/', '/trial', '/user/init'];

export async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const method = req.method;

  const isLoggedIn = await isUserLoggedIn();
  if (currentPath.startsWith('/dashboard')) {
    if (!isLoggedIn && method === 'GET') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else if (pathWithoutAuth.includes(currentPath)) {
    if (isLoggedIn && method === 'GET') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Cannot use Axios in Middleware
// Error: A Node.js API is used (setImmediate at line: 677) which is not supported in the Edge Runtime.
async function isUserLoggedIn() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${baseUrl}/is_logged_in`, {
      headers: {
        Cookie: `session=${cookieStore.get('session')?.value};`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

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
