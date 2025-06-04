'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ReferrerSourceAggregation } from '@/entities/referrers';
import { getReferrerColor } from '@/utils/referrerColors';
import { useMemo } from 'react';
import ReferrerLegend from './ReferrerLegend';

interface ReferrerDistributionChartProps {
  data?: ReferrerSourceAggregation[];
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
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return getPercentageDistribution(data);
  }, [data]);

  if (!data || data.length === 0 || chartData.length === 0) {
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
    <div className='flex h-[300px] w-full flex-col items-center'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill='#8884d8'
            dataKey='value'
            stroke='none'
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={getReferrerColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<ReferrerLegend showPercentage={true} />}
            verticalAlign='bottom'
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
