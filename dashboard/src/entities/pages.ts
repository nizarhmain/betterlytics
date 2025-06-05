import { z } from 'zod';

export const PageAnalyticsSchema = z.object({
  path: z.string(),
  title: z.string(),
  visitors: z.number(),
  pageviews: z.number(),
  bounceRate: z.number(),
  avgTime: z.number(),
  entryRate: z.number().optional(),
  exitRate: z.number().optional(),
});

export const TopPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number(),
});

export const TopEntryPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number(),
});

export const TopExitPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number(),
});

export const PageAnalyticsCombinedSchema = z.object({
  topPages: z.array(TopPageRowSchema),
  topEntryPages: z.array(TopEntryPageRowSchema),
  topExitPages: z.array(TopExitPageRowSchema),
});

export const DailyAverageTimeRowSchema = z.object({
  date: z.string(),
  avgTime: z.number(),
});

export const DailyBounceRateRowSchema = z.object({
  date: z.string(),
  bounceRate: z.number(),
});

export type PageAnalytics = z.infer<typeof PageAnalyticsSchema>;
export type TopPageRow = z.infer<typeof TopPageRowSchema>;
export type TopEntryPageRow = z.infer<typeof TopEntryPageRowSchema>;
export type TopExitPageRow = z.infer<typeof TopExitPageRowSchema>;
export type PageAnalyticsCombined = z.infer<typeof PageAnalyticsCombinedSchema>;

export type DailyAverageTimeRow = z.infer<typeof DailyAverageTimeRowSchema>;
export type DailyBounceRateRow = z.infer<typeof DailyBounceRateRowSchema>;
