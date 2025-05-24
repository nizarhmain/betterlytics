'server only';
import { type AuthContext } from "@/entities/authContext";

export async function fetchSiteId(ctx: AuthContext): Promise<string> {
  return ctx.siteId;
}
