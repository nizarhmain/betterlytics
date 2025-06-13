'use client';

import { useCallback, useState } from 'react';
import { PricingSlider, eventRanges } from './PricingSlider';
import { PricingCards } from './PricingCards';

interface PricingComponentProps {
  onPlanSelect?: (planName: string, planData: any) => void;
  initialRangeIndex?: number;
  className?: string;
}

export function PricingComponent({ onPlanSelect, initialRangeIndex = 0, className = '' }: PricingComponentProps) {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(initialRangeIndex);
  const currentRange = eventRanges[selectedRangeIndex];

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
        currentRange={currentRange}
        onPlanSelect={onPlanSelect}
        mode={onPlanSelect ? 'billing' : 'landing'}
      />
    </div>
  );
}
