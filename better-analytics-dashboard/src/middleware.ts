import { NextResponse, NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguages } from "@/app/[lang]/dictionaries";

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  const languageCode = acceptLanguage?.split(',')[0].split('-')[0]; // e.g. "en-GB" → "en"

  return SUPPORTED_LANGUAGES.includes(languageCode as SupportedLanguages)
    ? languageCode as SupportedLanguages
    : DEFAULT_LANGUAGE;
}
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (pathnameHasLocale) return

  const locale = getLocale(request)
  console.log("request.nexturl.pathname", request.nextUrl.pathname)
  request.nextUrl.pathname = `/${locale}${pathname}`

  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [ '/((?!_next|favicon.ico|.*\\..*|api).*)' ],
}
