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
  source_type: z.string(),
  source_name: z.string(),
  source_url: z.string().optional(),
  visits: z.number().int().min(0),
  bounce_rate: z.number().min(0),
  avg_visit_duration: z.number().min(0),
});

export const TopReferrerUrlSchema = z.object({
  referrer_url: z.string(),
  visits: z.number().int(),
});

export const TopChannelSchema = z.object({
  channel: z.string(),
  visits: z.number().int(),
});

export const TopReferrerSourceSchema = z.object({
  referrer_source: z.string(),
  visits: z.number().int(),
});

export type ReferrerSourceAggregation = z.infer<typeof ReferrerSourceAggregationSchema>;
export type ReferrerTrafficBySourceRow = z.infer<typeof ReferrerTrafficBySourceRowSchema>;
export type ReferrerSummary = z.infer<typeof ReferrerSummarySchema>;
export type ReferrerTableRow = z.infer<typeof ReferrerTableRowSchema>;
export type TopReferrerUrl = z.infer<typeof TopReferrerUrlSchema>;
export type TopChannel = z.infer<typeof TopChannelSchema>;
export type TopReferrerSource = z.infer<typeof TopReferrerSourceSchema>;