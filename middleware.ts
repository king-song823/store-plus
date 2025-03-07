export { auth as authMiddleware } from './auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

export const config = {
  matcher: ['/', '/(en|zh)/:path*'], // 匹配语言路径
};

export default function i18nMiddleware(req: NextRequest) {
  return createMiddleware(routing)(req);
}
