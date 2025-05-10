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

export const ReferrerSummarySchema = z.object({
  totalReferrers: z.number().int().min(0),
  referralTraffic: z.number().int().min(0),
  avgBounceRate: z.number().min(0).max(100),
});

export const ReferrerTableRowSchema = z.object({
  source: z.string(),
  visits: z.number().int().min(0),
  bounce_rate: z.number().min(0),
  avg_visit_duration: z.number().min(0),
});

export type ReferrerSourceAggregation = z.infer<typeof ReferrerSourceAggregationSchema>;
export type ReferrerTrafficBySourceRow = z.infer<typeof ReferrerTrafficBySourceRowSchema>;
export type ReferrerSummary = z.infer<typeof ReferrerSummarySchema>;
export type ReferrerTableRow = z.infer<typeof ReferrerTableRowSchema>;