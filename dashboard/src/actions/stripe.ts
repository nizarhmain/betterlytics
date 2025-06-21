'use server';

import { withUserAuth } from '@/auth/auth-actions';
import { stripe } from '@/lib/billing/stripe';
import { SelectedPlan, SelectedPlanSchema, Currency } from '@/types/pricing';
import { User } from 'next-auth';
import { env } from '@/lib/env';

async function getPriceWithCurrencyOptions(lookupKey: string, requestedCurrency: Currency): Promise<string> {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      limit: 1,
      expand: ['data.currency_options'],
    });

    if (prices.data.length === 0) {
      throw new Error(`No price found for lookup key: ${lookupKey}`);
    }

    const price = prices.data[0];

    const currencyLower = requestedCurrency.toLowerCase();
    if (price.currency !== currencyLower) {
      console.warn(`Requested currency ${requestedCurrency} not supported for price ${lookupKey}`);
    }

    return price.id;
  } catch (error) {
    console.error('Error retrieving price from lookup key:', error);
    throw new Error(`Failed to retrieve price for lookup key: ${lookupKey}`);
  }
}

export const createStripeCheckoutSession = withUserAuth(async (user: User, planData: SelectedPlan) => {
  try {
    const validatedPlan = SelectedPlanSchema.parse(planData);

    if (validatedPlan.price_cents === 0 && validatedPlan.tier === 'growth') {
      throw new Error('Free plans do not require checkout');
    }

    if (validatedPlan.tier === 'enterprise') {
      throw new Error('Custom plans require manual setup');
    }

    if (!validatedPlan.lookup_key) {
      throw new Error('No lookup key provided for plan');
    }

    const priceId = await getPriceWithCurrencyOptions(validatedPlan.lookup_key, validatedPlan.currency);

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      currency: validatedPlan.currency.toLowerCase(),
      customer_email: user.email,
      metadata: {
        userId: user.id,
        lookupKey: validatedPlan.lookup_key,
        requestedCurrency: validatedPlan.currency,
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

    if (error instanceof Error) {
      if (error.message.includes('currency')) {
        throw new Error('The selected currency is not supported for this plan. Please try a different currency.');
      }
      if (error.message.includes('lookup key')) {
        throw new Error('The selected plan configuration is not available. Please try a different plan.');
      }
    }

    throw new Error('Failed to create checkout session. Please try again.');
  }
});
