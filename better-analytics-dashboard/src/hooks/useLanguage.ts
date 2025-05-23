import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguages } from '@/app/[lang]/dictionaries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useLanguage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathLang = pathname?.split('/')[1];
  const currentLanguage = SUPPORTED_LANGUAGES.includes(pathLang as SupportedLanguages)
    ? (pathLang as SupportedLanguages)
    : DEFAULT_LANGUAGE;

  function setLanguage(newLanguage: SupportedLanguages) {
    if (!pathname) return;

    const segments = pathname.split('/');
    segments[1] = newLanguage;
    const newPath = segments.join('/');

    const queryString = searchParams.toString();
    const fullPath = `${newPath}${queryString ? `?${queryString}` : ''}`;
    router.push(fullPath);
  }

  return {
    setLanguage,
    currentLanguage,
  };
}
