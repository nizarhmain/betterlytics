import { formatNumber } from '@/utils/formatters';

export const EVENT_RANGES = [
  { value: 10_000, label: formatNumber(10_000, 0), price_cents: 0 },
  { value: 50_000, label: formatNumber(50_000, 0), price_cents: 700 },
  { value: 100_000, label: formatNumber(100_000, 0), price_cents: 1400 },
  { value: 200_000, label: formatNumber(200_000, 0), price_cents: 2500 },
  { value: 500_000, label: formatNumber(500_000, 0), price_cents: 3900 },
  { value: 1_000_000, label: formatNumber(1_000_000, 0), price_cents: 5900 },
  { value: 2_000_000, label: formatNumber(2_000_000, 0), price_cents: 8900 },
  { value: 5_000_000, label: formatNumber(5_000_000, 0), price_cents: 12900 },
  { value: 10_000_000, label: formatNumber(10_000_000, 0), price_cents: 16900 },
  { value: 10_000_001, label: '10M+', price_cents: -1 },
] as const;

export type EventRange = (typeof EVENT_RANGES)[number];

/**
 * Maps Stripe price lookup keys to tier and event limit
 */
export const TIER_CONFIG = {
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

export function getLookupKeyFromTierConfig(tier: string, eventLimit: number): TierLookupKey {
  const tierConfig = Object.values(TIER_CONFIG).find(
    (config) => config.tier === tier && config.eventLimit === eventLimit,
  ) as TierConfig | undefined;

  if (!tierConfig) {
    throw new Error(`No lookup key found for tier: ${tier} and event limit: ${eventLimit}`);
  }

  return Object.keys(TIER_CONFIG).find((key) => TIER_CONFIG[key as TierLookupKey] === tierConfig) as TierLookupKey;
}
