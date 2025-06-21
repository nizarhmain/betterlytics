'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getDeviceLabel, getDeviceColor } from '@/constants/deviceTypes';
import { DeviceIcon } from '@/components/icons';
import { useMemo } from 'react';
import { ChartTooltip } from '../charts/ChartTooltip';
import { capitalizeFirstLetter, formatPercentage } from '@/utils/formatters';

interface DeviceTypeChartProps {
  data: { name: string; value: number[]; percentage: number }[];
}

export default function DeviceTypeChart({ data }: DeviceTypeChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      color: getDeviceColor(d.name),
      label: getDeviceLabel(d.name),
    }));
  }, [data]);

  console.log(chartData);

  return (
    <div className='flex h-64 flex-col items-center'>
      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey='value.0'
            nameKey='label'
            cx='50%'
            cy='50%'
            innerRadius={50}
            outerRadius={70}
            fill='#8884d8'
            paddingAngle={2}
            label={false}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.label}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip labelFormatter={capitalizeFirstLetter} />}
            formatter={(value: any) => value.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2'>
        {chartData.map((entry) => (
          <div key={entry.label} className='flex items-center gap-1 text-sm'>
            <span className='inline-block h-3 w-3 rounded-full' style={{ backgroundColor: entry.color }}></span>
            <DeviceIcon type={entry.name} className='h-4 w-4' />
            <span className='text-foreground font-medium'>{entry.label}</span>
            <span className='text-muted-foreground'>{formatPercentage(entry.percentage)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
