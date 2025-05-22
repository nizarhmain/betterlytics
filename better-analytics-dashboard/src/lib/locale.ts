"server only";

import { getDictionary } from '@/app/[lang]/dictionaries';
import { Dictionary } from '@/contexts/DictionaryProvider';
import { headers } from 'next/headers';

export async function getLocale(): Promise<'en' | 'da'> {
  const acceptLanguage = (await headers()).get('accept-language');
  return (acceptLanguage?.split(',')[0] || 'en') as 'en' | 'da';
}

export async function getTranslations(): Promise<Dictionary> {
  const locale = await getLocale();
  console.log("Locale:", locale)
  return getDictionary(locale);
}


