import React from 'react';
import { ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line, ComposedChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { timeFormat } from 'd3-time-format';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface ChartDataPoint {
  date: string | number;
  value: number[];
}

interface InteractiveChartProps {
  title: string;
  data: ChartDataPoint[];
  color: string;
  formatValue?: (value: number) => string;
}

const InteractiveChart: React.FC<InteractiveChartProps> = React.memo(({ title, data, color, formatValue }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
      </CardHeader>

      <CardContent className='pb-0'>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-value`} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={color} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' className='opacity-10' />
              <XAxis
                dataKey='date'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className='text-muted-foreground'
                tickFormatter={timeFormat('%b %d')}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue ? formatValue : (value: number) => value.toLocaleString()}
                className='text-muted-foreground'
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number;
                    const formattedValue = formatValue ? formatValue(value) : value.toLocaleString();

                    const hasCompare = Boolean(payload[1]);

                    const compare = (payload[1]?.value ?? 0) as number;
                    const comparedTo = value - compare;
                    const formattedCompare = formatValue ? formatValue(compare) : compare.toLocaleString();
                    const formattedComparedTo = formatValue
                      ? formatValue(comparedTo)
                      : comparedTo.toLocaleString();

                    return (
                      <div className='bg-popover border-border rounded-lg border p-3 shadow-lg'>
                        <p className='text-muted-foreground text-sm'>{timeFormat('%b %d - %H:%M')(label)}</p>
                        <p className='text-foreground text-sm font-medium'>{formattedValue}</p>
                        {hasCompare && (
                          <div>
                            <Separator />
                            <span className='text-foreground mr-1 text-sm font-medium'>{formattedCompare}</span>
                            <span
                              className={cn(
                                'text-foreground text-sm font-medium',
                                comparedTo > 0 ? 'text-green-400' : 'text-destructive',
                                comparedTo === 0 && 'text-muted-foreground',
                              )}
                            >
                              ( {formattedComparedTo} )
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type='monotone'
                dataKey={'value.0'}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={'url(#gradient-value)'}
              />
              <Line
                type='monotone'
                dataKey={'value.1'}
                stroke={'var(--chart-comparison)'}
                strokeDasharray='4 4'
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

InteractiveChart.displayName = 'InteractiveChart';

export default InteractiveChart;
