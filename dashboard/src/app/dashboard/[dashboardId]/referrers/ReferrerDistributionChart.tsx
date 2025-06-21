'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ReferrerSourceAggregation } from '@/entities/referrers';
import { getReferrerColor } from '@/utils/referrerColors';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { capitalizeFirstLetter, formatPercentage } from '@/utils/formatters';

interface ReferrerDistributionChartProps {
  data?: { name: string; value: number[]; percentage: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-card border-border rounded-md border p-2 shadow-lg'>
        <p className='text-foreground text-sm'>{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Computes the percentage distribution of the referrer sources
const getPercentageDistribution = (data: ReferrerSourceAggregation[]) => {
  const total = data.reduce((sum, item) => sum + (item.visitorCount || 0), 0);
  return data.map((item) => ({
    name: item.referrer_source,
    value: total > 0 ? Number((((item.visitorCount || 0) / total) * 100).toFixed(1)) : 0,
  }));
};

export default function ReferrerDistributionChart({ data }: ReferrerDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-[300px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground mb-1'>No data available</p>
          <p className='text-muted-foreground/70 text-sm'>Try selecting a different time range</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-64 flex-col items-center'>
      <ResponsiveContainer width='100%' height={250}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill='#8884d8'
            dataKey='value.0'
            stroke='none'
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={getReferrerColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip labelFormatter={capitalizeFirstLetter} />}
            formatter={(value: any) => value.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2'>
        {data.map((entry) => (
          <div key={entry.name} className='flex items-center gap-1 text-sm'>
            <span
              className='inline-block h-3 w-3 rounded-full'
              style={{ backgroundColor: getReferrerColor(entry.name) }}
            ></span>
            <span className='text-foreground font-medium'>{capitalizeFirstLetter(entry.name)}</span>
            <span className='text-muted-foreground'>{formatPercentage(entry.percentage)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
