import { z } from "zod";

export const EventTypeRowSchema = z.object({
  event_name: z.string(),
  count: z.number(),
});

export type EventTypeRow = z.infer<typeof EventTypeRowSchema>;