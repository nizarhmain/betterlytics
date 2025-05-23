import { NextResponse, NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguages } from "@/app/[lang]/dictionaries";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get('accept-language');
  const headerLang = acceptLanguage?.split(',')[0].split('-')[0] ?? DEFAULT_LANGUAGE;

  const locale = SUPPORTED_LANGUAGES.includes(headerLang as SupportedLanguages)
    ? (headerLang as SupportedLanguages)
    : DEFAULT_LANGUAGE;

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
 
export const config = {
  matcher: [ '/((?!_next|favicon.ico|.*\\..*|api).*)' ],
}
 