import { z } from "zod";

export const PageAnalyticsSchema = z.object({
  path: z.string(),
  title: z.string(),
  visitors: z.number(),
  pageviews: z.number(),
  bounceRate: z.number(),
  avgTime: z.number()
});

export const TopPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number()
});

export const TopEntryPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number()
});

export const TopExitPageRowSchema = z.object({
  url: z.string(),
  visitors: z.number()
});

export const PageAnalyticsCombinedSchema = z.object({
  topPages: z.array(TopPageRowSchema),
  topEntryPages: z.array(TopEntryPageRowSchema),
  topExitPages: z.array(TopExitPageRowSchema),
});

export type PageAnalytics = z.infer<typeof PageAnalyticsSchema>;
export type TopPageRow = z.infer<typeof TopPageRowSchema>;
export type TopEntryPageRow = z.infer<typeof TopEntryPageRowSchema>;
export type TopExitPageRow = z.infer<typeof TopExitPageRowSchema>;
export type PageAnalyticsCombined = z.infer<typeof PageAnalyticsCombinedSchema>; 