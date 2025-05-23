import { DEFAULT_LANGUAGE, SupportedLanguages } from '@/app/[lang]/dictionaries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useLanguage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    currentLanguage: (pathname?.split('/')[1] || DEFAULT_LANGUAGE) as SupportedLanguages,
  };
}
