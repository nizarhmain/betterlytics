import prisma from '@/lib/postgres';
import { Subscription, SubscriptionSchema } from '@/entities/billing';
import { addMonths, startOfDay } from 'date-fns';
import { UpsertSubscriptionData, UpsertSubscriptionSchema } from '@/entities/billing';

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
  const now = startOfDay(new Date());
  const periodEnd = addMonths(now, 1);

  const subscription = await prisma.subscription.create({
    data: {
      user: { connect: { id: userId } },
      tier: 'growth',
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

export async function upsertSubscription(data: UpsertSubscriptionData): Promise<Subscription> {
  const validatedData = UpsertSubscriptionSchema.parse(data);

  const { userId, ...subscriptionData } = validatedData;

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: {
      user: { connect: { id: userId } },
      ...subscriptionData,
    },
    update: {
      ...subscriptionData,
    },
  });

  return SubscriptionSchema.parse(subscription);
}

export async function updateSubscriptionStatus(
  userId: string,
  status: string,
  cancelAtPeriodEnd?: boolean,
): Promise<Subscription | null> {
  try {
    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        status,
        ...(cancelAtPeriodEnd !== undefined && { cancelAtPeriodEnd }),
      },
    });

    return SubscriptionSchema.parse(subscription);
  } catch (error) {
    console.error('Failed to update subscription status:', error);
    return null;
  }
}

export async function getSubscriptionByPaymentId(paymentSubscriptionId: string): Promise<Subscription | null> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { paymentSubscriptionId },
    });

    return subscription ? SubscriptionSchema.parse(subscription) : null;
  } catch (error) {
    console.error('Failed to get subscription by payment ID:', error);
    return null;
  }
}
