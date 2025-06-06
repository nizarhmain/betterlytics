export const osIconNamesThemed = {
  windows: {
    light: 'mdi:microsoft-windows',
    dark: 'mdi:microsoft-windows',
  },
  macos: {
    light: 'logos:apple',
    dark: 'simple-icons:apple',
  },
  ios: {
    light: 'logos:apple',
    dark: 'simple-icons:apple',
  },
  android: {
    light: 'logos:android-icon',
    dark: 'logos:android-icon',
  },
  linux: {
    light: 'logos:linux-tux',
    dark: 'simple-icons:linux',
  },
  ubuntu: {
    light: 'logos:ubuntu',
    dark: 'logos:ubuntu',
  },
} as const;

export type OSType = keyof typeof osIconNamesThemed;

export const osLabels: Record<string, string> = {
  windows: 'Windows',
  macos: 'macOS',
  ios: 'iOS',
  android: 'Android',
  linux: 'Linux',
  ubuntu: 'Ubuntu',
};
