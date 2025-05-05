import { z } from "zod";

export const PageAnalyticsSchema = z.object({
  path: z.string(),
  title: z.string(),
  visitors: z.number(),
  pageviews: z.number(),
  bounceRate: z.number(),
  avgTime: z.number()
});

export type PageAnalytics = z.infer<typeof PageAnalyticsSchema>; 