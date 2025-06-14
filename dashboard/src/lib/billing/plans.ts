export const EVENT_RANGES = [
  { value: 10_000, label: '10K', price: 0 },
  { value: 50_000, label: '50K', price: 7 },
  { value: 100_000, label: '100K', price: 14 },
  { value: 200_000, label: '200K', price: 25 },
  { value: 500_000, label: '500K', price: 39 },
  { value: 1_000_000, label: '1M', price: 59 },
  { value: 2_000_000, label: '2M', price: 89 },
  { value: 5_000_000, label: '5M', price: 129 },
  { value: 10_000_000, label: '10M', price: 169 },
  { value: 25_000_000, label: '10M+', price: 'Custom' },
] as const;

export type EventRange = (typeof EVENT_RANGES)[number];

/**
 * Maps Stripe price lookup keys to tier and event limit
 */
export const TIER_CONFIG = {
  // Starter (free)
  starter_10000_events: {
    tier: 'starter',
    eventLimit: 10_000,
  },

  // Growth tier - all event limits
  growth_10000_events: {
    tier: 'growth',
    eventLimit: 10_000,
  },
  growth_50000_events: {
    tier: 'growth',
    eventLimit: 50_000,
  },
  growth_100000_events: {
    tier: 'growth',
    eventLimit: 100_000,
  },
  growth_200000_events: {
    tier: 'growth',
    eventLimit: 200_000,
  },
  growth_500000_events: {
    tier: 'growth',
    eventLimit: 500_000,
  },
  growth_1000000_events: {
    tier: 'growth',
    eventLimit: 1_000_000,
  },
  growth_2000000_events: {
    tier: 'growth',
    eventLimit: 2_000_000,
  },
  growth_5000000_events: {
    tier: 'growth',
    eventLimit: 5_000_000,
  },
  growth_10000000_events: {
    tier: 'growth',
    eventLimit: 10_000_000,
  },

  // Professional tier - all event limits
  professional_10000_events: {
    tier: 'professional',
    eventLimit: 10_000,
  },
  professional_50000_events: {
    tier: 'professional',
    eventLimit: 50_000,
  },
  professional_100000_events: {
    tier: 'professional',
    eventLimit: 100_000,
  },
  professional_200000_events: {
    tier: 'professional',
    eventLimit: 200_000,
  },
  professional_500000_events: {
    tier: 'professional',
    eventLimit: 500_000,
  },
  professional_1000000_events: {
    tier: 'professional',
    eventLimit: 1_000_000,
  },
  professional_2000000_events: {
    tier: 'professional',
    eventLimit: 2_000_000,
  },
  professional_5000000_events: {
    tier: 'professional',
    eventLimit: 5_000_000,
  },
  professional_10000000_events: {
    tier: 'professional',
    eventLimit: 10_000_000,
  },
} as const;

export type TierLookupKey = keyof typeof TIER_CONFIG;
export type TierConfig = (typeof TIER_CONFIG)[TierLookupKey];

export function getTierConfigFromLookupKey(lookupKey: string | null): TierConfig | null {
  if (!lookupKey || !(lookupKey in TIER_CONFIG)) {
    return null;
  }
  return TIER_CONFIG[lookupKey as TierLookupKey];
}
