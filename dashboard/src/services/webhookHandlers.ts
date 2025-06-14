import Stripe from 'stripe';
import {
  upsertSubscription,
  updateSubscriptionStatus,
  getSubscriptionByPaymentId,
} from '@/repositories/postgres/subscription';
import { createBillingHistoryEntry } from '@/repositories/postgres/billingHistory';
import { stripe } from '@/lib/stripe';

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    if (!session.metadata?.userId) {
      throw new Error('No userId in session metadata');
    }

    if (!session.subscription) {
      throw new Error('No subscription in session');
    }

    const { userId, tier, eventLimit } = session.metadata;
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const pricePerMonth = subscription.items.data[0].price.unit_amount || 0;
    const paymentPriceId = subscription.items.data[0].price.id;

    await upsertSubscription({
      userId,
      tier,
      status: 'processing',
      eventLimit: parseInt(eventLimit),
      pricePerMonth,
      paymentCustomerId: session.customer as string,
      paymentSubscriptionId: session.subscription as string,
      paymentPriceId,
    });

    await updateSubscriptionStatus(userId, 'processing');
  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionDetails = invoice.parent?.subscription_details;

    if (!subscriptionDetails || !subscriptionDetails.subscription) {
      console.log('Invoice has no subscription details, skipping');
      return;
    }

    const subscriptionId = subscriptionDetails.subscription as string;
    const subscription = await getSubscriptionByPaymentId(subscriptionId);
    if (!subscription) {
      console.log('No local subscription found for Stripe subscription:', subscriptionId);
      return;
    }

    await updateSubscriptionStatus(subscription.userId, 'active');

    await createBillingHistoryEntry({
      userId: subscription.userId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      eventCount: 0,
      eventLimit: subscription.eventLimit,
      amountPaid: invoice.amount_paid,
      paymentInvoiceId: invoice.id,
      paymentPaymentIntentId: undefined,
      status: 'paid',
    });
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const localSubscription = await getSubscriptionByPaymentId(subscription.id);
    if (!localSubscription) {
      console.log('No local subscription found for Stripe subscription:', subscription.id);
      return;
    }

    await updateSubscriptionStatus(localSubscription.userId, 'canceled');
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription.updated:', subscription.id);
}
