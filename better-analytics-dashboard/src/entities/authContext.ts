import { z } from "zod";

export const AuthContextSchema = z.object({
  dashboardId: z.string(),
  userId: z.string(),
  siteId: z.string(),
  role: z.string()
});
export type AuthContext = z.infer<typeof AuthContextSchema>;
