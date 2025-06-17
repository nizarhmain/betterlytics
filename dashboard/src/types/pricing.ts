import { z } from 'zod';
import { TierSchema } from '@/entities/billing';

export const SelectedPlanSchema = z.object({
  tier: TierSchema,
  eventLimit: z.number(),
  price_cents: z.number(),
  period: z.string(),
});

export type SelectedPlan = z.infer<typeof SelectedPlanSchema>;
