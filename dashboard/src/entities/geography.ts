import { z } from "zod";

export const GeoVisitorSchema = z.object({
  country_code: z.string(),
  visitors: z.preprocess(val => Number(val), z.number()),
});

export type GeoVisitor = z.infer<typeof GeoVisitorSchema>; 