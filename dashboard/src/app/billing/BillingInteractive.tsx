'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PricingComponent } from '@/components/pricing/PricingComponent';
import { SelectedPlan, SelectedPlanSchema } from '@/types/pricing';
import { createStripeCheckoutSession, createStripeCustomerPortalSession } from '@/actions/stripe';
import type { Currency, UserBillingData } from '@/entities/billing';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BillingInteractiveProps {
  billingData: UserBillingData;
}

export function BillingInteractive({ billingData }: BillingInteractiveProps) {
  const searchParams = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

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

  const handleCurrencyChange = useCallback((currency: string) => {
    setSelectedCurrency(currency as Currency);
  }, []);

  return (
    <div className='relative'>
      <PricingComponent
        onPlanSelect={handlePlanSelect}
        billingData={billingData}
        defaultCurrency={selectedCurrency}
      />

      <div className='mt-6 text-center'>
        {billingData.isExistingPaidSubscriber ? (
          <p className='text-muted-foreground text-sm'>
            Changes to your subscription will be processed immediately through Stripe's secure billing portal.
          </p>
        ) : (
          <p className='text-muted-foreground text-sm'>Start with our free plan - no credit card required.</p>
        )}
      </div>

      <div className='text-muted-foreground absolute top-0 mt-2 flex flex-shrink-0 justify-end text-xs'>
        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
          <SelectTrigger size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='USD'>USD ($)</SelectItem>
              <SelectItem value='EUR'>EUR (€)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
