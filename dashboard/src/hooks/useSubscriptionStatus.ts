import type { getUserBillingData } from '@/actions/billing';

type BillingData = Awaited<ReturnType<typeof getUserBillingData>>;

export function useSubscriptionStatus(billingData: BillingData) {
  const subscription = billingData.subscription;
  const usage = billingData.usage;

  const isExistingPaidSubscriber = subscription.pricePerMonth > 0 && subscription.status === 'active';
  const isFreePlanUser = subscription.pricePerMonth === 0;

  return {
    subscription,
    usage,
    isExistingPaidSubscriber,
    isFreePlanUser,
  };
}
