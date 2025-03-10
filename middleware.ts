export { auth as authMiddleware } from './auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/', '/(en|zh)/:path*'],
};

export default async function i18nMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  const locale = response.cookies.get('locale')?.value;
  if (!locale) {
    const newLocale = pathname.slice(1, 3);
    response.cookies.set('locale', newLocale, {
      httpOnly: true, // 禁止 JavaScript 访问 Cookie
      secure: process.env.NODE_ENV === 'production', // 在生产环境中使用 secure 标志
      path: '/', // Cookie 对全站有效
      sameSite: 'strict', // 防止跨站请求伪造攻击
    });
  }
  // **Middleware 需要返回 `response`，否则 `Set-Cookie` 不会生效**
  const middlewareResponse = createMiddleware(routing)(req);

  // **合并 Middleware 结果**
  middlewareResponse.headers.set(
    'Set-Cookie',
    response.headers.get('Set-Cookie') || ''
  );

  return middlewareResponse;
}
