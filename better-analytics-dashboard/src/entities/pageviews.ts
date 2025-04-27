import { z } from "zod";

export const DailyPageViewRowSchema = z.object({
  date: z.string(),
  url: z.string(),
  views: z.number(),
});

export const PageviewsCountRowSchema = z.object({
    total: z.number(),
});

export const DailyUniqueVisitorsRowSchema = z.object({
  date: z.string(),
  unique_visitors: z.preprocess(val => Number(val), z.number()),
});

export type DailyPageViewRow = z.infer<typeof DailyPageViewRowSchema>;
export type PageviewsCountRow = z.infer<typeof PageviewsCountRowSchema>;
export type DailyUniqueVisitorsRow = z.infer<typeof DailyUniqueVisitorsRowSchema>; 