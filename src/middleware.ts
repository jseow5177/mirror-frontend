export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getBaseUrl } from './app/_lib/axios';

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

// Cannot use Axios in Middleware
// Error: A Node.js API is used (setImmediate at line: 677) which is not supported in the Edge Runtime.
async function isUserLoggedIn() {
  const cookieStore = cookies();
  try {
    await fetch(`${getBaseUrl()}/is_logged_in`, {
      headers: {
        Cookie: `session=${cookieStore.get('session')?.value};`,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
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
