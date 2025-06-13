export const EVENT_RANGES = [
  { value: 10_000, label: '10K', price: 0 },
  { value: 50_000, label: '50K', price: 6 },
  { value: 100_000, label: '100K', price: 13 },
  { value: 150_000, label: '150K', price: 20 },
  { value: 200_000, label: '200K', price: 27 },
  { value: 500_000, label: '500K', price: 48 },
  { value: 1_000_000, label: '1M', price: 69 },
  { value: 2_000_000, label: '2M', price: 132 },
  { value: 5_000_000, label: '5M', price: 209 },
  { value: 10_000_000, label: '10M', price: 349 },
  { value: 25_000_000, label: '10M+', price: 'Custom' },
] as const;

export type EventRange = (typeof EVENT_RANGES)[number];
