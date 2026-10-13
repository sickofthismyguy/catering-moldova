import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LANGS = ['ro', 'ru', 'en'];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const alreadyLocalized = LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (alreadyLocalized) return NextResponse.next();

  // Let Next handle its own files, API routes and static assets.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Guess language from the browser (default = Romanian for Moldova).
  const accept = (request.headers.get('accept-language') || '').toLowerCase();
  let lang = 'ro';
  if (accept.startsWith('ru')) lang = 'ru';
  else if (accept.startsWith('en')) lang = 'en';

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)'],
};
