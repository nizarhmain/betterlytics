'use client';

import React, { useMemo } from 'react';
import { PivotedCampaignVisitorTrendItem } from '@/entities/campaign';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getCampaignSourceColor } from '@/utils/campaignColors';

interface CampaignVisitorTrendChartProps {
  data: PivotedCampaignVisitorTrendItem[];
  isLoading: boolean;
}

export default function CampaignVisitorTrendChart({ data, isLoading }: CampaignVisitorTrendChartProps) {
  const campaignKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0].campaignValues || {});
  }, [data]);

  if (isLoading) {
    return (
      <div className='bg-card border-border flex min-h-[350px] items-center justify-center rounded-lg border p-6 shadow'>
        <p className='text-muted-foreground'>Loading visitor trend data...</p>
      </div>
    );
  }

  if (!data || data.length === 0 || campaignKeys.length === 0) {
    return (
      <div className='bg-card border-border flex min-h-[350px] items-center justify-center rounded-lg border p-6 shadow'>
        <p className='text-muted-foreground'>No campaign visitor trend data available.</p>
      </div>
    );
  }

  return (
    <div className='bg-card border-border rounded-lg border p-6 shadow'>
      <h2 className='text-foreground mb-1 text-lg font-bold'>Campaign Visitor Trend</h2>
      <p className='text-muted-foreground mb-4 text-sm'>Visitor trends over time by campaign</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: '4px',
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
              }}
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
            />
            {campaignKeys.map((campaignName) => (
              <Area
                key={campaignName}
                type='monotone'
                dataKey={`campaignValues.${campaignName}`}
                stackId='1'
                stroke={getCampaignSourceColor(campaignName)}
                fill={getCampaignSourceColor(campaignName)}
                fillOpacity={0.7}
                name={campaignName}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className='mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm'>
        {campaignKeys.map((campaignName) => (
          <div key={campaignName} className='flex items-center'>
            <span
              className='mr-1.5 inline-block h-3 w-3 rounded-full'
              style={{ backgroundColor: getCampaignSourceColor(campaignName) }}
            ></span>
            <span className='text-muted-foreground'>{campaignName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
