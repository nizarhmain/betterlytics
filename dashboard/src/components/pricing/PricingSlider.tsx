'use client';

// TODO: Get from a pricing service or config or smth - perhaps move to pricing component as well
const eventRanges = [
  { value: 10_000, label: '10K', price: 0 },
  { value: 50_000, label: '50K', price: 6 },
  { value: 100_000, label: '100K', price: 13 },
  { value: 150_000, label: '150K', price: 20 },
  { value: 200_000, label: '200K', price: 27 },
  { value: 500_000, label: '500K', price: 48 },
  { value: 1_000_000, label: '1M', price: 69 },
  { value: 2_000_000, label: '2M', price: 132 },
  { value: 5_000_000, label: '5M', price: 209 },
  { value: 10_000_000, label: '10M', price: 349 },
  { value: 25_000_000, label: '10M+', price: 'Custom' },
] as const;

type EventRange = (typeof eventRanges)[number];

interface PricingSliderProps {
  currentRange: EventRange;
  selectedRangeIndex: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function PricingSlider({
  currentRange,
  selectedRangeIndex,
  handleSliderChange,
  className = '',
}: PricingSliderProps) {
  return (
    <div className={`mx-auto max-w-lg ${className}`}>
      <div className='mb-4 text-center'>
        <div className='text-muted-foreground mb-2 text-sm'>Monthly Events</div>
        <div className='text-3xl font-bold'>{currentRange.label}</div>
      </div>

      <div className='relative'>
        <input
          type='range'
          value={selectedRangeIndex}
          onChange={handleSliderChange}
          max={eventRanges.length - 1}
          min={0}
          step={1}
          className='slider h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700'
        />

        <div className='mt-3 flex justify-between'>
          {eventRanges.map((range) => (
            <div
              key={range.label}
              className={`text-xs transition-colors ${
                range.label === currentRange.label ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { eventRanges };
export type { EventRange };
