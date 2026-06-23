import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((m) => m.default),
  ar: () => import('./ar.json').then((m) => m.default),
  tr: () => import('./tr.json').then((m) => m.default),
  pl: () => import('./pl.json').then((m) => m.default),
}

export const locales = ['en', 'ar', 'tr', 'pl'] as const
export type Locale = (typeof locales)[number]

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale)

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
