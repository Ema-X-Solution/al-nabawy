import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const locales = ['en', 'ar', 'tr', 'pl'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || ''
  const preferred = acceptLanguage.split(',')[0]?.trim().split('-')[0]?.toLowerCase()
  if (preferred && (locales as readonly string[]).includes(preferred)) {
    return preferred as Locale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, api routes, Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect to locale-prefixed path
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|images|.*\\..*).*)'],
}
