import prisma from '@/lib/postgres';
import { Subscription, SubscriptionSchema } from '@/entities/billing';

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      subscription = await createDefaultStarterSubscription(userId);
    }

    return SubscriptionSchema.parse(subscription);
  } catch (error) {
    console.error('Failed to get user subscription:', error);
    return null;
  }
}

async function createDefaultStarterSubscription(userId: string): Promise<Subscription> {
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      tier: 'starter',
      eventLimit: 10000,
      pricePerMonth: 0,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      status: 'active',
      cancelAtPeriodEnd: false,
    },
  });

  return SubscriptionSchema.parse(subscription);
}
