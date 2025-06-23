'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PricingComponent } from '@/components/pricing/PricingComponent';
import { SelectedPlan, SelectedPlanSchema } from '@/types/pricing';
import { createStripeCheckoutSession, createStripeCustomerPortalSession } from '@/actions/stripe';
import type { UserBillingData } from '@/entities/billing';

interface BillingInteractiveProps {
  billingData: UserBillingData;
}

export function BillingInteractive({ billingData }: BillingInteractiveProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('canceled') === 'true') {
      toast.info('Checkout was canceled. You can try again anytime.');
    }
  }, [searchParams]);

  const handlePlanSelect = async (planData: SelectedPlan) => {
    try {
      const validatedPlan = SelectedPlanSchema.parse(planData);

      if (validatedPlan.tier === 'enterprise') {
        toast.info('Please contact us for a custom plan');
        return;
      }

      if (billingData.isExistingPaidSubscriber) {
        const portalUrl = await createStripeCustomerPortalSession(validatedPlan);
        if (portalUrl) {
          window.location.href = portalUrl;
        } else {
          throw new Error('No customer portal URL received');
        }
        return;
      }

      const result = await createStripeCheckoutSession(validatedPlan);
      if (result) {
        window.location.href = result;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch {
      toast.error('Failed to process plan selection, please try again.');
    }
  };

  return (
    <>
      <PricingComponent onPlanSelect={handlePlanSelect} billingData={billingData} defaultCurrency={'USD'} />

      <div className='mt-6 text-center'>
        {billingData.isExistingPaidSubscriber ? (
          <p className='text-muted-foreground text-sm'>
            Changes to your subscription will be processed immediately through Stripe's secure billing portal.
          </p>
        ) : (
          <p className='text-muted-foreground text-sm'>Start with our free plan - no credit card required.</p>
        )}
      </div>
    </>
  );
}
