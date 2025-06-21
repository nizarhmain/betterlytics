import { z } from 'zod';
import { TierSchema } from '@/entities/billing';

export const CurrencySchema = z.enum(['USD', 'EUR']);
export type Currency = z.infer<typeof CurrencySchema>;

export const SelectedPlanSchema = z.object({
  tier: TierSchema,
  eventLimit: z.number(),
  price_cents: z.number(),
  period: z.string(),
  currency: CurrencySchema.default('USD'),
  lookup_key: z.string().nullable(),
});

export type SelectedPlan = z.infer<typeof SelectedPlanSchema>;
