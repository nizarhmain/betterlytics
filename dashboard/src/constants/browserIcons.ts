export const browserIconNames = {
  chrome: 'logos:chrome',
  firefox: 'logos:firefox',
  safari: 'logos:safari',
  edge: 'logos:microsoft-edge',
  opera: 'logos:opera',
  brave: 'logos:brave',
  vivaldi: 'logos:vivaldi',
  arc: 'simple-icons:arc',
} as const;

export type BrowserType = keyof typeof browserIconNames;

export const browserLabels: Record<string, string> = {
  chrome: 'Google Chrome',
  firefox: 'Mozilla Firefox',
  safari: 'Safari',
  edge: 'Microsoft Edge',
  opera: 'Opera',
  brave: 'Brave',
  vivaldi: 'Vivaldi',
  arc: 'Arc',
};
