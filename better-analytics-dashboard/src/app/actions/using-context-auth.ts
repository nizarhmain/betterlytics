"server only";

import { type AuthContext } from "@/entities/authContext";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { authorizeUserDashboard } from "@/services/auth.service";

export async function usingAuthContext(dashboardId: string): Promise<AuthContext> {
  const session = await requireDashboardAuth();
  const context = await authorizeUserDashboard(session.user.id, dashboardId);
  return context;
}
