'use server';

import { withUserAuth } from '@/auth/auth-actions';
import { stripe } from '@/lib/stripe';
import { SelectedPlan, SelectedPlanSchema } from '@/types/pricing';
import { getAuthSession } from '@/auth/auth-actions';

export const createStripeCheckoutSession = withUserAuth(async (userId: string, planData: SelectedPlan) => {
  try {
    const validatedPlan = SelectedPlanSchema.parse(planData);

    if (validatedPlan.price === 0 || validatedPlan.price === 'Free') {
      throw new Error('Free plans do not require checkout');
    }

    if (validatedPlan.price === 'Custom') {
      throw new Error('Custom plans require manual setup');
    }

    const userSession = await getAuthSession();

    const priceId = await getStripePriceId(validatedPlan.eventLimit);

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userSession?.user?.email || undefined,
      metadata: {
        userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      /*automatic_tax: {
        enabled: true,
      },*/
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return checkoutSession.url;
  } catch (error) {
    console.error('Failed to create Stripe checkout session:', error);

    if (error instanceof Error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }

    throw new Error('Failed to create checkout session');
  }
});

/*
 * The lookup key is a custom key that is used to identify the price for the product created in the Stripe dashboard.
 */
const getStripePriceId = async (eventLimit: number) => {
  const lookupKey = `analytics_${eventLimit}_events`;

  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    expand: ['data.product'],
  });

  if (!prices.data || prices.data.length === 0) {
    throw new Error(`No Stripe price found for lookup key: ${lookupKey}`);
  }

  return prices.data[0].id;
};
