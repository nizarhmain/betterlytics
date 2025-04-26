import { z } from "zod";

export const PageviewsCountRowSchema = z.object({
  total: z.number(),
});

export type PageviewsCountRow = z.infer<typeof PageviewsCountRowSchema>;