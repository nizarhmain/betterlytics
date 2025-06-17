'use server';

import { withUserAuth } from '@/auth/auth-actions';
import { getUserBillingStats, getUserBillingHistory } from '@/services/billing';
import { type UserBillingData } from '@/entities/billing';
import { User } from 'next-auth';

export const getUserBillingData = withUserAuth(async (user: User): Promise<UserBillingData> => {
  return getUserBillingStats(user.id);
});

export const getUserBillingHistoryData = withUserAuth(async (user: User) => {
  try {
    return await getUserBillingHistory(user.id);
  } catch (error) {
    console.error('Failed to fetch billing history:', error);
    return [];
  }
});
