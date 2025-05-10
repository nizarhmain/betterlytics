import { z } from "zod";

export const ReferrerSourceAggregationSchema = z.object({
  referrer_source: z.string(),
  visitorCount: z.number(),
});

export type ReferrerSourceAggregation = z.infer<typeof ReferrerSourceAggregationSchema>;