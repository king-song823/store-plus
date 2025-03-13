export { auth as authMiddleware } from './auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/',
    '/(en|zh)/:path*',
    '/((?!api|_next/|images/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export default async function i18nMiddleware(req: NextRequest) {
  const middlewareResponse = createMiddleware(routing)(req);
  return middlewareResponse;
}
