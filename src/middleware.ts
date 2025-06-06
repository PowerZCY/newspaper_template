import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { appConfig } from "@/lib/appConfig";

const intlMiddleware = createMiddleware({
  // 多语言配置
  locales: appConfig.i18n.locales,

  // 默认语言配置
  defaultLocale: appConfig.i18n.defaultLocale,
  localePrefix: "always", // 改为 always，确保始终使用语言前缀
  localeDetection: false  // 添加此配置以禁用自动语言检测
});

export default function middleware(req: NextRequest) {
  // 处理尾部斜杠的重定向
  if (req.nextUrl.pathname.length > 1 && req.nextUrl.pathname.endsWith("/")) {
    const newUrl = new URL(req.nextUrl.pathname.slice(0, -1), req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
      // Skip Next.js internals and all static files, unless found in search params, skip api and trpc
      '/((?!api|trpc|_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};