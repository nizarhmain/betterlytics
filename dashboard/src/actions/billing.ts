'use server';

import { withUserAuth } from '@/auth/auth-actions';
import { getUserBillingStats, getUserBillingHistory } from '@/services/billing';
import { UserBillingDataSchema, type UserBillingData } from '@/entities/billing';

export const getUserBillingData = withUserAuth(async (userId: string): Promise<UserBillingData> => {
  try {
    const stats = await getUserBillingStats(userId);

    if (!stats) {
      return UserBillingDataSchema.parse(getDefaultBillingData());
    }

    const billingData = {
      subscription: {
        tier: stats.subscription.tier,
        eventLimit: stats.subscription.eventLimit,
        pricePerMonth: stats.subscription.pricePerMonth,
        currentPeriodEnd: stats.subscription.currentPeriodEnd,
        status: stats.subscription.status,
      },
      usage: stats.usage,
      usagePercentage: stats.usagePercentage,
      daysUntilReset: stats.daysUntilReset,
    };

    return UserBillingDataSchema.parse(billingData);
  } catch (error) {
    console.error('Failed to fetch user billing data:', error);
    return UserBillingDataSchema.parse(getDefaultBillingData());
  }
});

export const getUserBillingHistoryData = withUserAuth(async (userId: string) => {
  try {
    return await getUserBillingHistory(userId);
  } catch (error) {
    console.error('Failed to fetch billing history:', error);
    return [];
  }
});

function getDefaultBillingData() {
  return {
    subscription: {
      tier: 'starter',
      eventLimit: 10000,
      pricePerMonth: 0,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
    },
    usage: {
      current: 0,
      limit: 10000,
      remaining: 10000,
      isOverLimit: false,
      billingPeriod: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    usagePercentage: 0,
    daysUntilReset: 30,
  };
}
