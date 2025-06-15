'use client';

import { useCallback, useState } from 'react';
import { PricingSlider } from './PricingSlider';
import { PricingCards } from './PricingCards';
import { SelectedPlan } from '@/types/pricing';
import { EVENT_RANGES } from '@/lib/billing/plans';
import type { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

interface PricingComponentProps {
  onPlanSelect?: (planData: SelectedPlan) => void;
  initialRangeIndex?: number;
  className?: string;
  subscriptionStatus?: ReturnType<typeof useSubscriptionStatus>;
}

export function PricingComponent({
  onPlanSelect,
  initialRangeIndex = 0,
  className = '',
  subscriptionStatus,
}: PricingComponentProps) {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(initialRangeIndex);
  const currentRange = EVENT_RANGES[selectedRangeIndex];

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSelectedRangeIndex(index);
  }, []);

  return (
    <div className={className}>
      <PricingSlider
        currentRange={currentRange}
        selectedRangeIndex={selectedRangeIndex}
        handleSliderChange={handleSliderChange}
        className='mb-12'
      />

      <PricingCards
        eventLimit={currentRange.value}
        eventLabel={currentRange.label}
        basePrice={currentRange.price}
        onPlanSelect={onPlanSelect}
        mode={onPlanSelect ? 'billing' : 'landing'}
        subscriptionStatus={subscriptionStatus}
      />
    </div>
  );
}
