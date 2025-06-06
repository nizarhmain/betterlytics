'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import { osIconNamesThemed, osLabels, type OSType } from '@/constants/operatingSystemIcons';

interface OSIconProps {
  name: string;
  className?: string;
}

export const OSIcon = React.memo<OSIconProps>(({ name, className = 'h-3.5 w-3.5' }) => {
  const { theme } = useTheme();

  const iconName = React.useMemo(() => {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '') as OSType;
    const iconVariants = osIconNamesThemed[normalizedName];

    if (!iconVariants) return null;

    return theme === 'dark' ? iconVariants.dark : iconVariants.light;
  }, [name, theme]);

  if (!iconName) {
    return <Monitor className={className} />;
  }

  return <Icon icon={iconName} className={className} />;
});

OSIcon.displayName = 'OSIcon';

export const getOSLabel = (osName: string): string => {
  return osLabels[osName.toLowerCase().replace(/\s+/g, '')] || osName;
};
