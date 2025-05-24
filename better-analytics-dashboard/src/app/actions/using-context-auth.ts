"server only";

import { type AuthContext } from "@/entities/authContext";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { authorizeUserDashboard } from "@/services/auth.service";

type ActionRequiringAuthContext<Args extends Array<unknown>, Ret> = (context: AuthContext, ...args: Args) => Ret;

export function withDashboardAuthContext<Args extends Array<unknown> = unknown[], Ret = unknown>(action: ActionRequiringAuthContext<Args, Ret>) {
  return async function(dashboardId: string, ...args: Args): Promise<Awaited<Ret>> {
    const session = await requireDashboardAuth();
    const context = await authorizeUserDashboard(session.user.id, dashboardId);

    try {
      return await action(context, ...args);
    } catch(e) {
      console.error("Error occurred:", e);
      throw new Error('An error occurred');
    }
  }
}

export type GetAuthRestProps<T> = T extends (context: AuthContext, ...args: infer Args) => unknown ? Args : never;
export type PublicAuthAction<Action extends (...props: any[]) => any> = (dashboardId: string, ...props: GetAuthRestProps<Action>) => ReturnType<Action>;
