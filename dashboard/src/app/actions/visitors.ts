'use server';

import { withDashboardAuthContext } from '@/auth/auth-actions';
import { AuthContext } from '@/entities/authContext';
import { getActiveUsersForSite } from '@/services/visitors';

export const fetchActiveUsersAction = withDashboardAuthContext(async (ctx: AuthContext) => {
  return getActiveUsersForSite(ctx.siteId);
});
