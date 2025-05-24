'server only';
import { usingAuthContext } from "./using-context-auth";

export async function fetchSiteId(dashboardId: string): Promise<string> {
  const ctx = await usingAuthContext(dashboardId);
  return ctx.siteId;
}
