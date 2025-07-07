import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { appConfig } from "@/lib/appConfig";

const intlMiddleware = createMiddleware({
  locales: appConfig.i18n.locales,
  defaultLocale: appConfig.i18n.defaultLocale,
  localePrefix: "always",
  localeDetection: false
});

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.length > 1 && req.nextUrl.pathname.endsWith("/")) {
    const newUrl = new URL(req.nextUrl.pathname.slice(0, -1), req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, sitemap, robots, and all .txt files, unless in search params, skip api and trpc
    '/((?!api|trpc|_next|[^?]*.(?:html?|txt|xml|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|pdf|mp3|mp4|docx?|xlsx?|zip|webmanifest|otf)).*)',
  ],
};