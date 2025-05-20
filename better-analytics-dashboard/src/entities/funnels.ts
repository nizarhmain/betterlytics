import { z } from "zod";

export const FunnelSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  pages: z.string().array(),
  dashboardId: z.string().cuid(),
});

export const FunnelDetailsSchema = FunnelSchema.extend({
  visitors: z.number().array()
});

export const CreateFunnelSchema = z.object({
  name: z.string().min(1, "Funnel name is required"),
  pages: z.string().array(),
  dashboardId: z.string().cuid("Valid Dashboard ID is required"),
});

export type Funnel = z.infer<typeof FunnelSchema>;
export type FunnelDetails = z.infer<typeof FunnelDetailsSchema>;
export type CreateFunnel = z.infer<typeof CreateFunnelSchema>;
