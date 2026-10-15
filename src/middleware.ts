import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LANGS = ['ro', 'ru', 'en'];

/** Does this client prefer Markdown over HTML? (Browsers always send text/html.) */
function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/markdown') && !accept.includes('text/html');
}

function withVary(res: NextResponse): NextResponse {
  res.headers.append('Vary', 'Accept');
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Internal Markdown renderer: never redirect/rewrite it again.
  if (pathname.startsWith('/internal-md')) return NextResponse.next();

  const alreadyLocalized = LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  const isAssetOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.');

  // Content negotiation: agents asking for Markdown get the Markdown mirror.
  if (alreadyLocalized && !isAssetOrApi && wantsMarkdown(request)) {
    // Pass the original path via a request header: rewrite destinations do
    // not reliably keep query strings across Next versions.
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-md-path', pathname);
    const res = NextResponse.rewrite(new URL('/internal-md', request.url), {
      request: { headers: reqHeaders },
    });
    res.headers.append('Vary', 'Accept');
    return res;
  }

  if (alreadyLocalized) return withVary(NextResponse.next());

  if (isAssetOrApi) return withVary(NextResponse.next());

  // Guess language from the browser (default = Romanian for Moldova).
  const accept = (request.headers.get('accept-language') || '').toLowerCase();
  let lang = 'ro';
  if (accept.startsWith('ru')) lang = 'ru';
  else if (accept.startsWith('en')) lang = 'en';

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return withVary(NextResponse.redirect(url, 308));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)'],
};
