"server only";

import { DEFAULT_LANGUAGE, getDictionary, SupportedLanguages } from '@/app/[lang]/dictionaries';
import { Dictionary } from '@/contexts/DictionaryProvider';
import { headers } from 'next/headers';

export async function getLocale(): Promise<SupportedLanguages> {
  const acceptLanguage = (await headers()).get('accept-language');
  return (acceptLanguage?.split(',')[0] || DEFAULT_LANGUAGE) as SupportedLanguages;
}

export async function getTranslations(): Promise<Dictionary> {
  const locale = await getLocale();
  return getDictionary(locale);
}


