'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';

import { SUPPORTED_LANGUAGES, SupportedLanguages } from '@/app/[lang]/dictionaries';
import { FlagIcon, type FlagIconProps } from '@/components/FlagIcon';
import { useLanguage } from '@/hooks/useLanguage';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

type LanguageSelectProps = Omit<React.ComponentProps<typeof SelectTrigger>, 'children'> & {
  selectProps?: React.ComponentProps<typeof Select>;
};

const LANGUAGE_TO_COUNTRYCODE = {
  en: 'GB', 
  da: 'DK',
} satisfies Record<SupportedLanguages, FlagIconProps['countryCode']>;

export function LanguageSelect({ className, style, selectProps }: LanguageSelectProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const { open } = useSidebar();

  return (
    <Select value={currentLanguage} onValueChange={setLanguage} {...selectProps}>
      <SelectTrigger className={cn(className, !open && "[&>svg:last-child]:hidden" )} style={style}>
        <SelectValue>
          {currentLanguage && (
            <div className="flex items-center gap-2 p-0 m-0">
              <FlagIcon countryCode={LANGUAGE_TO_COUNTRYCODE[currentLanguage]} className="w-4 h-4"/>
              <span className={cn(!open && "hidden")}>{currentLanguage.toUpperCase()}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            <div className="flex items-center gap-2 p-0 m-0">
              <FlagIcon countryCode={LANGUAGE_TO_COUNTRYCODE[lang]} className="w-4 h-4" />
              <span>{lang.toUpperCase()}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}