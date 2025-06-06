import React from 'react';
import { Globe } from 'lucide-react';
import { Icon } from '@iconify/react';
import { browserIconNames, browserLabels, type BrowserType } from '@/constants/browserIcons';

interface BrowserIconProps {
  name: string;
  className?: string;
}

export const BrowserIcon = React.memo<BrowserIconProps>(({ name, className = 'h-3.5 w-3.5' }) => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '') as BrowserType;
  const iconName = browserIconNames[normalizedName];

  if (!iconName) {
    return <Globe className={className} />;
  }

  return <Icon icon={iconName} className={className} />;
});

BrowserIcon.displayName = 'BrowserIcon';

export const getBrowserLabel = (browserName: string): string => {
  return browserLabels[browserName.toLowerCase().replace(/\s+/g, '')] || browserName;
};
