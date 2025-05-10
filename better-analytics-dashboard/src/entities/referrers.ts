import { z } from "zod";

export const ReferrerSourceAggregationSchema = z.object({
  referrer_source: z.string(),
  visitorCount: z.number().int().min(0),
});

export const ReferrerTrafficBySourceRowSchema = z.object({
  date: z.string(),
  referrer_source: z.string(),
  count: z.number(),
});

export type ReferrerSourceAggregation = z.infer<typeof ReferrerSourceAggregationSchema>;
export type ReferrerTrafficBySourceRow = z.infer<typeof ReferrerTrafficBySourceRowSchema>;