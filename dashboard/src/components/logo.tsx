'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'simple' | 'full' | 'icon';
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Logo({ variant = 'simple', className, width, height, priority = false }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light theme until mounted to prevent hydration mismatch
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light';
  const isDark = currentTheme === 'dark';

  const logoSources = {
    simple: {
      dark: '/betterlytics-logo-light-simple.svg',
      light: '/betterlytics-logo-dark-simple.svg',
    },
    full: {
      dark: '/logo-light-svg-full.svg',
      light: '/logo-dark-svg-full.svg',
    },
    icon: {
      dark: '/images/favicon-light.svg',
      light: '/images/favicon-dark.svg',
    },
  };

  const defaultDimensions = {
    simple: { width: 32, height: 32 },
    full: { width: 150, height: 40 },
    icon: { width: 24, height: 24 },
  };

  const logoSrc = isDark ? logoSources[variant].dark : logoSources[variant].light;
  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height,
  };

  return (
    <Image
      src={logoSrc}
      alt='Betterlytics'
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn('object-contain', className)}
    />
  );
}
