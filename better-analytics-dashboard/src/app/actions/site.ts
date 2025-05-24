'use server';
import { AuthContext } from "@/entities/authContext";
import { withDashboardAuthContext } from "./using-context-auth";

export const fetchSiteId = withDashboardAuthContext(async (ctx: AuthContext): Promise<string> => {
  return ctx.siteId;
});
