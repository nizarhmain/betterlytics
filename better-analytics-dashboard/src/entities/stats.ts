import { z } from "zod";

export const SummaryStatsSchema = z.object({
  uniqueVisitors: z.number(),
  pageviews: z.number(),
  bounceRate: z.number(),
  avgVisitDuration: z.number()
});

export type SummaryStats = z.infer<typeof SummaryStatsSchema>; 