import { formatNumber } from '@/utils/formatters';

export const EVENT_RANGES = [
  {
    value: 10_000,
    label: formatNumber(10_000, 0),
    growth: {
      price: {
        usd_cents: 0,
        eur_cents: 0,
      },
      lookup_key: 'growth_10000_events',
    },
    professional: {
      price: {
        usd_cents: 1400,
        eur_cents: 1200,
      },
      lookup_key: 'professional_10000_events',
    },
  },
  {
    value: 50_000,
    label: formatNumber(50_000, 0),
    growth: {
      price: {
        usd_cents: 700,
        eur_cents: 600,
      },
      lookup_key: 'growth_50000_events',
    },
    professional: {
      price: {
        usd_cents: 1400,
        eur_cents: 1200,
      },
      lookup_key: 'professional_50000_events',
    },
  },
  {
    value: 100_000,
    label: formatNumber(100_000, 0),
    growth: {
      price: {
        usd_cents: 1400,
        eur_cents: 1200,
      },
      lookup_key: 'growth_100000_events',
    },
    professional: {
      price: {
        usd_cents: 2800,
        eur_cents: 2500,
      },
      lookup_key: 'professional_100000_events',
    },
  },
  {
    value: 200_000,
    label: formatNumber(200_000, 0),
    growth: {
      price: {
        usd_cents: 2500,
        eur_cents: 2200,
      },
      lookup_key: 'growth_200000_events',
    },
    professional: {
      price: {
        usd_cents: 5000,
        eur_cents: 4400,
      },
      lookup_key: 'professional_200000_events',
    },
  },
  {
    value: 500_000,
    label: formatNumber(500_000, 0),
    growth: {
      price: {
        usd_cents: 3900,
        eur_cents: 3500,
      },
      lookup_key: 'growth_500000_events',
    },
    professional: {
      price: {
        usd_cents: 7800,
        eur_cents: 6900,
      },
      lookup_key: 'professional_500000_events',
    },
  },
  {
    value: 1_000_000,
    label: formatNumber(1_000_000, 0),
    growth: {
      price: {
        usd_cents: 5900,
        eur_cents: 5200,
      },
      lookup_key: 'growth_1000000_events',
    },
    professional: {
      price: {
        usd_cents: 11800,
        eur_cents: 10500,
      },
      lookup_key: 'professional_1000000_events',
    },
  },
  {
    value: 2_000_000,
    label: formatNumber(2_000_000, 0),
    growth: {
      price: {
        usd_cents: 8900,
        eur_cents: 7900,
      },
      lookup_key: 'growth_2000000_events',
    },
    professional: {
      price: {
        usd_cents: 17800,
        eur_cents: 15800,
      },
      lookup_key: 'professional_2000000_events',
    },
  },
  {
    value: 5_000_000,
    label: formatNumber(5_000_000, 0),
    growth: {
      price: {
        usd_cents: 12900,
        eur_cents: 11500,
      },
      lookup_key: 'growth_5000000_events',
    },
    professional: {
      price: {
        usd_cents: 25800,
        eur_cents: 22900,
      },
      lookup_key: 'professional_5000000_events',
    },
  },
  {
    value: 10_000_000,
    label: formatNumber(10_000_000, 0),
    growth: {
      price: {
        usd_cents: 16900,
        eur_cents: 14900,
      },
      lookup_key: 'growth_10000000_events',
    },
    professional: {
      price: {
        usd_cents: 33800,
        eur_cents: 29900,
      },
      lookup_key: 'professional_10000000_events',
    },
  },
  {
    value: 10_000_001,
    label: '10M+',
    growth: {
      price: {
        usd_cents: -1,
        eur_cents: -1,
      },
      lookup_key: null,
    },
    professional: {
      price: {
        usd_cents: -1,
        eur_cents: -1,
      },
      lookup_key: null,
    },
  },
] as const;

export type EventRange = (typeof EVENT_RANGES)[number];
export type TierName = 'growth' | 'professional';

export function getTierConfigFromLookupKey(lookupKey: string): { tier: TierName; eventLimit: number } {
  for (const range of EVENT_RANGES) {
    if (range.growth.lookup_key === lookupKey) {
      return { tier: 'growth', eventLimit: range.value };
    }
    if (range.professional.lookup_key === lookupKey) {
      return { tier: 'professional', eventLimit: range.value };
    }
  }

  throw new Error(`Unknown price lookup key: ${lookupKey}`);
}
