'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getCampaignSourceColor } from '@/utils/campaignColors';
import { StackedAreaChartTooltip } from '@/components/charts/StackedAreaChartTooltip';

interface CampaignVisitorTrendChartProps {
  chartData: Array<{ date: number } & Record<string, number>>;
  categories: string[];
  compareData?: Array<{ date: number } & Record<string, number>>;
}

export default function CampaignVisitorTrendChart({
  chartData,
  categories,
  compareData,
}: CampaignVisitorTrendChartProps) {
  if (!chartData || chartData.length === 0 || categories.length === 0) {
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
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              content={(props) => (
                <StackedAreaChartTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  compareData={compareData}
                  formatter={(value: number) => `${value.toLocaleString()} visitors`}
                />
              )}
            />
            {categories.map((campaignName) => (
              <Area
                key={campaignName}
                type='monotone'
                dataKey={campaignName}
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
        {categories.map((campaignName) => (
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
