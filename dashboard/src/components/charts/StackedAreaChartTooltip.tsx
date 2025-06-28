'use client';

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getTrendInfo, formatDifference } from '@/utils/chartUtils';

interface PayloadEntry {
  value: number;
  dataKey: string;
  name?: string;
  color?: string;
}

interface StackedAreaChartTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string | number;
  formatter?: (value: number) => string;
  labelFormatter?: (date: string | number) => string;
  compareData?: Array<{ date: number } & Record<string, number>>;
}

export function StackedAreaChartTooltip({
  active,
  payload,
  label,
  formatter = (value) => value.toLocaleString(),
  labelFormatter = (date) => format(new Date(date), 'MMM dd, yyyy HH:mm'),
  compareData,
}: StackedAreaChartTooltipProps) {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }

  const hasComparison = !!compareData;

  const comparePoint = hasComparison ? compareData.find((point) => point.date === Number(label)) : null;

  const getCurrentValue = (entry: PayloadEntry): number => {
    return entry.value || 0;
  };

  const getCompareValue = (entry: PayloadEntry): number => {
    return comparePoint ? comparePoint[entry.dataKey] || 0 : 0;
  };

  const currentTotal = payload.reduce((sum: number, entry: PayloadEntry) => sum + getCurrentValue(entry), 0);
  const compareTotal = comparePoint
    ? payload.reduce((sum: number, entry: PayloadEntry) => sum + (comparePoint[entry.dataKey] || 0), 0)
    : 0;

  const sortedPayload = [...payload].sort((a, b) => getCurrentValue(b) - getCurrentValue(a));

  const totalTrend = getTrendInfo(currentTotal, compareTotal, hasComparison);
  const totalDifference = formatDifference(currentTotal, compareTotal, formatter, hasComparison);

  return (
    <div className='animate-in fade-in-0 zoom-in-95 min-w-[220px] rounded-lg border border-gray-700/50 bg-gray-900/95 p-4 shadow-xl backdrop-blur-sm duration-200'>
      <div className='mb-3 border-b border-gray-700/50 pb-2'>
        <span className='text-xs font-medium tracking-wide text-gray-300 uppercase'>{labelFormatter(label)}</span>
      </div>

      <div className='mb-3'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='mb-1 text-xs text-gray-400'>Current Total</div>
            <div className='text-lg font-semibold text-white'>{formatter(currentTotal)}</div>
          </div>

          {hasComparison && (
            <div className='text-right'>
              <div className='mb-1 text-xs text-gray-400'>Previous Total</div>
              <div className='text-sm text-gray-300'>{formatter(compareTotal)}</div>
            </div>
          )}
        </div>

        {hasComparison && totalDifference && (
          <div className='mt-2'>
            <div
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium',
                totalTrend.bgColor,
              )}
            >
              {React.createElement(totalTrend.icon, { className: cn('h-3 w-3', totalTrend.color) })}
              <span className={totalTrend.color}>{totalDifference}</span>
            </div>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div className='text-xs text-gray-400'>Breakdown</div>
        <div className='space-y-2'>
          {sortedPayload.map((entry, index) => {
            const currentValue = getCurrentValue(entry);
            const compareValue = getCompareValue(entry);
            const trend = getTrendInfo(currentValue, compareValue, hasComparison);
            const difference = formatDifference(currentValue, compareValue, formatter, hasComparison);

            return (
              <div key={entry.dataKey || index} className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full' style={{ backgroundColor: entry.color }} />
                    <span className='text-sm text-gray-300'>{entry.name || entry.dataKey}</span>
                  </div>
                  <span className='text-sm font-medium text-white'>{formatter(currentValue)}</span>
                </div>

                {hasComparison && (
                  <div className='ml-4 flex items-center justify-between text-xs'>
                    <span className='text-gray-400'>vs {formatter(compareValue)}</span>
                    {difference && (
                      <div
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium',
                          trend.bgColor,
                        )}
                      >
                        {React.createElement(trend.icon, { className: cn('h-3 w-3', trend.color) })}
                        <span className={trend.color}>{difference}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
