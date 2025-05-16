import { z } from 'zod';

export const RawCampaignDataSchema = z.object({
  utm_campaign_name: z.string(),
  total_visitors: z.number().int().nonnegative(),
  bounced_sessions: z.number().int().nonnegative(),
  total_sessions: z.number().int().nonnegative(),
  total_pageviews: z.number().int().nonnegative(),
  sum_session_duration_seconds: z.number().int().nonnegative(),
});

export const CampaignPerformanceSchema = z.object({
  name: z.string(),
  visitors: z.number().int().nonnegative(),
  bounceRate: z.number().nonnegative(),
  avgSessionDuration: z.string(),
  pagesPerSession: z.number().nonnegative(),
});

export const CampaignSourceBreakdownItemSchema = z.object({
  source: z.string(),
  visitors: z.number().int().nonnegative(),
});

// For UTM Medium Breakdown
export const CampaignMediumBreakdownItemSchema = z.object({
  medium: z.string(),
  visitors: z.number().int().nonnegative(),
});

export type RawCampaignData = z.infer<typeof RawCampaignDataSchema>;
export type CampaignPerformance = z.infer<typeof CampaignPerformanceSchema>;
export type CampaignSourceBreakdownItem = z.infer<typeof CampaignSourceBreakdownItemSchema>;
export type CampaignMediumBreakdownItem = z.infer<typeof CampaignMediumBreakdownItemSchema>;
export const RawCampaignDataArraySchema = z.array(RawCampaignDataSchema);
export const CampaignPerformanceArraySchema = z.array(CampaignPerformanceSchema);
export const CampaignSourceBreakdownArraySchema = z.array(CampaignSourceBreakdownItemSchema);
export const CampaignMediumBreakdownArraySchema = z.array(CampaignMediumBreakdownItemSchema); 