'use server';

import { Dashboard } from '@/entities/dashboard';
import { withUserAuth, withDashboardAuthContext } from '@/auth/auth-actions';
import { createNewDashboard, getAllUserDashboards } from '@/services/dashboard';
import { findFirstUserDashboard, findDashboardById } from '@/repositories/postgres/dashboard';
import { User } from 'next-auth';
import { AuthContext } from '@/entities/authContext';

export const createDashboardAction = withUserAuth(async (user: User, domain: string): Promise<Dashboard> => {
  return createNewDashboard(domain, user.id);
});

export const getFirstUserDashboardAction = withUserAuth(async (user: User): Promise<Dashboard | null> => {
  return findFirstUserDashboard(user.id);
});

export const getAllUserDashboardsAction = withUserAuth(async (user: User): Promise<Dashboard[]> => {
  return getAllUserDashboards(user.id);
});

export const getCurrentDashboardAction = withDashboardAuthContext(async (ctx: AuthContext): Promise<Dashboard> => {
  return findDashboardById(ctx.dashboardId);
});
