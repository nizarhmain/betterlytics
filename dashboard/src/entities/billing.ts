import { z } from 'zod';

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tier: z.string(),
  eventLimit: z.number(),
  pricePerMonth: z.number(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  quotaExceededDate: z.date().nullable(),
  status: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  paymentCustomerId: z.string().nullable(),
  paymentSubscriptionId: z.string().nullable(),
  paymentPriceId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UsageDataSchema = z.object({
  current: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isOverLimit: z.boolean(),
  billingPeriod: z.object({
    start: z.date(),
    end: z.date(),
  }),
});

export const BillingStatsSchema = z.object({
  subscription: SubscriptionSchema,
  usage: UsageDataSchema,
  usagePercentage: z.number(),
  daysUntilReset: z.number(),
});

export const EventCountResultSchema = z.object({
  total: z.number(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type UsageData = z.infer<typeof UsageDataSchema>;
export type BillingStats = z.infer<typeof BillingStatsSchema>;
export type EventCountResult = z.infer<typeof EventCountResultSchema>;
