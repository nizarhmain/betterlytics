'use server';

import { withUserAuth } from '@/auth/auth-actions';
import { stripe } from '@/lib/billing/stripe';
import { SelectedPlan, SelectedPlanSchema } from '@/types/pricing';
import { getLookupKeyFromTierConfig } from '@/lib/billing/plans';
import { User } from 'next-auth';
import { env } from '@/lib/env';

export const createStripeCheckoutSession = withUserAuth(async (user: User, planData: SelectedPlan) => {
  try {
    const validatedPlan = SelectedPlanSchema.parse(planData);

    if (validatedPlan.price_cents === 0 && validatedPlan.tier === 'growth') {
      throw new Error('Free plans do not require checkout');
    }

    if (validatedPlan.tier === 'enterprise') {
      throw new Error('Custom plans require manual setup');
    }

    const lookupKey = getLookupKeyFromTierConfig(validatedPlan.tier, validatedPlan.eventLimit);

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: lookupKey,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing?canceled=true`,
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
    throw new Error('Failed to create checkout session');
  }
});
