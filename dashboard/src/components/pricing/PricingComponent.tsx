'use client';

import { useCallback, useState } from 'react';
import { PricingSlider } from './PricingSlider';
import { PricingCards } from './PricingCards';
import { SelectedPlan, Currency } from '@/types/pricing';
import { EVENT_RANGES } from '@/lib/billing/plans';
import type { UserBillingData } from '@/entities/billing';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingComponentProps {
  onPlanSelect?: (planData: SelectedPlan) => void;
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrency);
  const currentRange = EVENT_RANGES[selectedRangeIndex];

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSelectedRangeIndex(index);
  }, []);

  const handleCurrencyChange = useCallback((currency: string) => {
    setSelectedCurrency(currency as Currency);
  }, []);

  return (
    <div className={className}>
      <div className='mb-12 flex items-center justify-between gap-8'>
        <div className='flex-1'>
          <PricingSlider
            currentRange={currentRange}
            selectedRangeIndex={selectedRangeIndex}
            handleSliderChange={handleSliderChange}
          />
        </div>

        <div className='flex-shrink-0'>
          <Tabs value={selectedCurrency} onValueChange={handleCurrencyChange} className='w-fit'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='USD'>USD ($)</TabsTrigger>
              <TabsTrigger value='EUR'>EUR (€)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <PricingCards
        eventRange={currentRange}
        onPlanSelect={onPlanSelect}
        mode={onPlanSelect ? 'billing' : 'landing'}
        billingData={billingData}
        currency={selectedCurrency}
      />
    </div>
  );
}
