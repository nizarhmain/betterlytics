import { z } from "zod";

export const FunnelSchema = z.object({
  name: z.string(),
  pages: z.string().array(),
});

export const CreateFunnelSchema = z.object({
  name: z.string(),
  pages: z.string().array(),
  siteId: z.string(),
});

export type Funnel = z.infer<typeof FunnelSchema>;
export type CreateFunnel = z.infer<typeof CreateFunnelSchema>;
