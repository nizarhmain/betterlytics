import Stripe from 'stripe';
import {
  upsertSubscription,
  updateSubscriptionStatus,
  getSubscriptionByPaymentId,
} from '@/repositories/postgres/subscription';
import { createBillingHistoryEntry } from '@/repositories/postgres/billingHistory';
import type { Currency, PaymentStatus } from '@/entities/billing';
import { stripe } from '@/lib/billing/stripe';
import { getTierConfigFromLookupKey } from '@/lib/billing/plans';

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    if (!session.metadata?.userId) {
      throw new Error('No userId in session metadata');
    }

    if (!session.subscription) {
      throw new Error('No subscription in session');
    }

    const { userId } = session.metadata;
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const subscriptionItem = stripeSubscription.items.data[0];
    const pricePerMonth = subscriptionItem.price.unit_amount || 0;

    const tierConfig = getTierConfigFromLookupKey(subscriptionItem.price.lookup_key as string);

    await upsertSubscription({
      userId,
      tier: tierConfig.tier,
      status: 'active',
      eventLimit: tierConfig.eventLimit,
      pricePerMonth,
      currency: subscriptionItem.price.currency.toUpperCase() as Currency,
      cancelAtPeriodEnd: false,
      currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
      paymentCustomerId: stripeSubscription.customer as string,
      paymentSubscriptionId: session.subscription as string,
      paymentPriceId: subscriptionItem.price.id,
    });
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

    await createBillingHistoryEntry({
      userId: subscription.userId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      eventLimit: subscription.eventLimit,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency.toUpperCase() as Currency,
      paymentInvoiceId: invoice.id,
      paymentPaymentIntentId: undefined,
      status: 'paid' as PaymentStatus,
    });
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionDetails = invoice.parent?.subscription_details;

    if (!subscriptionDetails || !subscriptionDetails.subscription) {
      console.log('Invoice payment failed but has no subscription details, skipping');
      return;
    }

    const subscriptionId = subscriptionDetails.subscription as string;
    const subscription = await getSubscriptionByPaymentId(subscriptionId);

    if (!subscription) {
      console.log('No local subscription found for failed payment:', subscriptionId);
      return;
    }

    await updateSubscriptionStatus(subscription.userId, 'past_due');
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
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

    const now = new Date();

    // Downgrade to free Growth plan
    await upsertSubscription({
      userId: localSubscription.userId,
      tier: 'growth',
      status: 'active',
      eventLimit: 10000,
      pricePerMonth: 0,
      currency: localSubscription.currency,
      currentPeriodStart: now,
      currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      paymentCustomerId: undefined,
      paymentSubscriptionId: undefined,
      paymentPriceId: undefined,
    });
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const localSubscription = await getSubscriptionByPaymentId(subscription.id);
    if (!localSubscription) {
      throw new Error(`No local subscription found for Stripe subscription: ${subscription.id}`);
    }

    const subscriptionItem = subscription.items.data[0];
    const pricePerMonth = subscriptionItem.price.unit_amount || 0;

    const tierConfig = getTierConfigFromLookupKey(subscriptionItem.price.lookup_key as string);

    await upsertSubscription({
      userId: localSubscription.userId,
      tier: tierConfig.tier,
      status: subscription.status,
      eventLimit: tierConfig.eventLimit,
      pricePerMonth,
      currency: subscriptionItem.price.currency.toUpperCase() as Currency,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
      paymentCustomerId: subscription.customer as string,
      paymentSubscriptionId: subscription.id,
      paymentPriceId: subscriptionItem.price.id,
    });
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}
