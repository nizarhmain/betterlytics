import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';

export const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
} as const;

export type DeviceType = keyof typeof deviceIcons;

export const deviceLabels = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  laptop: 'Laptop',
} as const;
