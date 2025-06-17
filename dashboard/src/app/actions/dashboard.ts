'use server';

import { Dashboard } from '@/entities/dashboard';
import { withUserAuth } from '@/auth/auth-actions';
import { createNewDashboard, getAllUserDashboards } from '@/services/dashboard';
import { findFirstUserDashboard } from '@/repositories/postgres/dashboard';
import { User } from 'next-auth';

export const createDashboardAction = withUserAuth(async (user: User, domain: string): Promise<Dashboard> => {
  return createNewDashboard(domain, user.id);
});

export const getFirstUserDashboardAction = withUserAuth(async (user: User): Promise<Dashboard | null> => {
  return findFirstUserDashboard(user.id);
});

export const getAllUserDashboardsAction = withUserAuth(async (user: User): Promise<Dashboard[]> => {
  return getAllUserDashboards(user.id);
});
