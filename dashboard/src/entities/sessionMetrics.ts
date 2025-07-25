import { z } from 'zod';

export const DailySessionMetricsRowSchema = z.object({
  date: z.string(),
  bounce_rate: z.number(),
  avg_visit_duration: z.number(),
  pages_per_session: z.number(),
});

export type DailySessionMetricsRow = z.infer<typeof DailySessionMetricsRowSchema>;
