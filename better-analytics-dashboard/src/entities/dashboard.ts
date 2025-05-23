import { z } from "zod";

export const DashboardSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  domain: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const DashboardWriteSchema = z.object({
  siteId: z.string(),
  domain: z.string(),
  userId: z.string(),
});

export const DashboardFindByUserSchema = z.object({
  userId: z.string(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
export type DashboardWriteData = z.infer<typeof DashboardWriteSchema>;
export type DashboardFindByUserData = z.infer<typeof DashboardFindByUserSchema>; 