'use client';

import { Dispatch, useCallback, useState } from 'react';
import { PricingSlider } from './PricingSlider';
import { PricingCards } from './PricingCards';
import { SelectedPlan } from '@/types/pricing';
import { EVENT_RANGES } from '@/lib/billing/plans';
import type { Currency, UserBillingData } from '@/entities/billing';

interface PricingComponentProps {
  onPlanSelect?: Dispatch<SelectedPlan>;
  initialRangeIndex?: number;
  className?: string;
  billingData?: UserBillingData;
  defaultCurrency?: Currency;
}

export function PricingComponent({
  onPlanSelect,
  initialRangeIndex = 0,
  className = '',
  billingData,
  defaultCurrency = 'USD',
}: PricingComponentProps) {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(initialRangeIndex);
  const currentRange = EVENT_RANGES[selectedRangeIndex];

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSelectedRangeIndex(index);
  }, []);

  return (
    <div className={className}>
      <div className='mb-12 flex items-center justify-center gap-8'>
        <div className='mx-1 w-full lg:w-1/2'>
          <PricingSlider
            currentRange={currentRange}
            selectedRangeIndex={selectedRangeIndex}
            handleSliderChange={handleSliderChange}
          />
        </div>
      </div>

      <PricingCards
        eventRange={currentRange}
        onPlanSelect={onPlanSelect}
        mode={onPlanSelect ? 'billing' : 'landing'}
        billingData={billingData}
        currency={defaultCurrency}
      />
    </div>
  );
}
