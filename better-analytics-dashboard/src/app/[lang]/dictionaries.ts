import 'server-only'

export const SUPPORTED_LANGUAGES = ['en', 'da'] as const;
const dictionaries = {  
  en: () => import('@/app/[lang]/dictionaries/en.json').then((module) => module.default),
  da: () => import('@/app/[lang]/dictionaries/da.json').then((module) => module.default),
}

export type SupportedLanguages = keyof typeof dictionaries;

export const getDictionary = async (locale: SupportedLanguages) =>
  (locale in dictionaries ? dictionaries[locale] : dictionaries['en'])()
