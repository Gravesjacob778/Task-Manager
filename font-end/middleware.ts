import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const locales = ['zh-TW', 'en'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true, // 可選，自動偵測語系
});

export function middleware(request: NextRequest) {
  console.log('👉 middleware 被觸發: ', request.nextUrl.pathname);
  // 排除不需要處理的路徑（像 API、靜態資源）
  const publicFile = /\.(.*)$/;
  const pathname = request.nextUrl.pathname;

  if (
    publicFile.test(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('/favicon') ||
    pathname.includes('/fonts') ||
    pathname.includes('/images')
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
   matcher: ['/((?!api|_next|.*\\..*).*)']
};
