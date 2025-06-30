'use client';

import React from 'react';
import { DatePicker } from './DatePicker';
import type { TZDate } from '@/utils/timezoneHelpers';

interface DateRangeSectionProps {
  startDate: TZDate | undefined;
  endDate: TZDate | undefined;
  onStartDateSelect: (date: TZDate | undefined) => void;
  onEndDateSelect: (date: TZDate | undefined) => void;
  userTimezone?: string;
}

export function DateRangeSection({
  startDate,
  endDate,
  onStartDateSelect,
  onEndDateSelect,
  userTimezone,
}: DateRangeSectionProps) {
  return (
    <div>
      <h3 className='mb-2 text-sm font-medium text-gray-500'>Current period</h3>
      <div className='grid grid-cols-2 gap-4'>
        <DatePicker
          label='Start date'
          date={startDate}
          onDateSelect={(date) => onStartDateSelect(date as TZDate)}
          disabled={(date) => {
            if (endDate && date > endDate) {
              return true;
            }
            return date > new Date();
          }}
          id='startDateInput'
          userTimezone={userTimezone}
        />
        <DatePicker
          label='End date'
          date={endDate}
          onDateSelect={(date) => onEndDateSelect(date as TZDate)}
          disabled={(date) => {
            if (startDate && date < startDate) {
              return true;
            }
            return date > new Date();
          }}
          id='endDateInput'
          userTimezone={userTimezone}
        />
      </div>
    </div>
  );
}
