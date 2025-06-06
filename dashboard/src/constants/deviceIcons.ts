import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';

export const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
} as const;

export type DeviceType = keyof typeof deviceIcons;

export const deviceLabels: Record<string, string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  laptop: 'Laptop',
};
