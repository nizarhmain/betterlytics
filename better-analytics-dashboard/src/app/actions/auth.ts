import { AuthContext } from "@/entities/authContext";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { authorizeUserDashboard } from "@/services/auth.service";

type ActionRequiringAuthContext<Args extends Array<unknown>> = (context: AuthContext, ...args: Args) => unknown;

export function withDashboardAuthContext<Args extends Array<unknown> = unknown[]>(action: ActionRequiringAuthContext<Args>) {
  return async function(dashboardId: string, ...args: Args) {
    const session = await requireDashboardAuth();
    const context = await authorizeUserDashboard(session.user.id, dashboardId);

    try {
      return await action(context, ...args);
    } catch {
      throw new Error('En error occured');
    }
  }
}

export type GetAuthRestProps<T> = T extends (context: AuthContext, ...args: infer Args) => unknown ? Args : never;
export type PublicAuthAction<Action extends (...props: any[]) => any> = (dashboardId: string, ...props: GetAuthRestProps<Action>) => ReturnType<Action>;  
