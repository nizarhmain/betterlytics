export const SUPPORTED_LANGUAGES = ['en', 'da'] as const;

const dictionaries = {  
  en: () => import('@/app/dictionaries/en.json').then((module) => module.default),
  da: () => import('@/app/dictionaries/da.json').then((module) => module.default),
}

export type SupportedLanguages = keyof typeof dictionaries;
export const DEFAULT_LANGUAGE: SupportedLanguages = 'en';

export const getDictionary = async (locale: SupportedLanguages) =>
  (locale in dictionaries ? dictionaries[locale] : dictionaries[DEFAULT_LANGUAGE])()