import { z } from "zod";
import { DailyUniqueVisitorsRowSchema } from "./visitors";
import { TotalPageViewRowSchema } from "./pageviews";
import { DailySessionMetricsRowSchema } from "./sessionMetrics";

export const SummaryStatsWithChartsSchema = z.object({
  uniqueVisitors: z.number(),
  pageviews: z.number(),
  bounceRate: z.number(),
  avgVisitDuration: z.number(),
  visitorsChartData: z.array(DailyUniqueVisitorsRowSchema),
  pageviewsChartData: z.array(TotalPageViewRowSchema),
  bounceRateChartData: z.array(DailySessionMetricsRowSchema),
  avgVisitDurationChartData: z.array(DailySessionMetricsRowSchema)
});

export type SummaryStatsWithCharts = z.infer<typeof SummaryStatsWithChartsSchema>; 