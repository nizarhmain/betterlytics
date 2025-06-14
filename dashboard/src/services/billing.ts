import { getUserSubscription } from '@/repositories/postgres/subscription';
import { getUserSiteIds } from '@/repositories/postgres/dashboard';
import { getUserEventCountForPeriod } from '@/repositories/clickhouse/usage';
import { getBillingHistoryByUserId } from '@/repositories/postgres/billingHistory';
import { toDateString } from '@/utils/dateFormatters';
import type { UsageData, BillingStats, BillingHistory } from '@/entities/billing';

export async function getUserBillingStats(userId: string): Promise<BillingStats | null> {
  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      return null;
    }

    const siteIds = await getUserSiteIds(userId);

    const currentUsage = await getUserEventCountForPeriod(siteIds, toDateString(subscription.currentPeriodStart));

    const usage: UsageData = {
      current: currentUsage,
      limit: subscription.eventLimit,
      remaining: Math.max(0, subscription.eventLimit - currentUsage),
      isOverLimit: currentUsage >= subscription.eventLimit,
      billingPeriod: {
        start: subscription.currentPeriodStart,
        end: subscription.currentPeriodEnd,
      },
    };

    const usagePercentage = (currentUsage / subscription.eventLimit) * 100;
    const daysUntilReset = getDaysUntilReset(subscription.currentPeriodEnd);

    return {
      subscription,
      usage,
      usagePercentage,
      daysUntilReset,
    };
  } catch (error) {
    console.error('Failed to get billing stats:', error);
    return null;
  }
}

export async function getUserBillingHistory(userId: string): Promise<BillingHistory[]> {
  try {
    return await getBillingHistoryByUserId(userId);
  } catch (error) {
    console.error('Failed to get billing history:', error);
    return [];
  }
}

function getDaysUntilReset(endDate: Date): number {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
