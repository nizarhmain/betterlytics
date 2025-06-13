import { z } from 'zod';

export const TierSchema = z.enum(['starter', 'professional', 'enterprise']);
export type Tier = z.infer<typeof TierSchema>;

export const SelectedPlanSchema = z.object({
  tier: TierSchema,
  eventLimit: z.number(),
  price: z.union([z.string(), z.number()]), // "Free", "Custom", or "$6"
  period: z.string(),
});

export type SelectedPlan = z.infer<typeof SelectedPlanSchema>;

// Schema for subscription data prepared for payment processing
export const SubscriptionDataSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email().nullable(),
  userName: z.string().nullable(),
  tier: TierSchema,
  eventLimit: z.number(),
  price: z.union([z.string(), z.number()]),
  period: z.string(),
});

export type SubscriptionData = z.infer<typeof SubscriptionDataSchema>;
