'use client';

import React, { useMemo } from 'react';
import { PivotedCampaignVisitorTrendItem } from '@/entities/campaign';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getCampaignSourceColor } from '@/utils/campaignColors';

interface CampaignVisitorTrendChartProps {
  data: PivotedCampaignVisitorTrendItem[];
  isLoading: boolean;
}

export default function CampaignVisitorTrendChart({ data, isLoading }: CampaignVisitorTrendChartProps) {
  if (isLoading) {
    return (
      <div>
        <p>Loading visitor trend data...</p>
      </div>
    );
  }

  const campaignKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0].campaignValues || {});
  }, [data]);

  if (!data || data.length === 0 || campaignKeys.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 min-h-[350px] flex items-center justify-center">
        <p className="text-gray-500">No campaign visitor trend data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Campaign Visitor Trend</h2>
      <p className="text-sm text-gray-500 mb-4">Visitor trends over time by campaign</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: '4px' }}
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
            />
            {campaignKeys.map((campaignName) => (
              <Area
                key={campaignName}
                type="monotone"
                dataKey={`campaignValues.${campaignName}`}
                stackId="1"
                stroke={getCampaignSourceColor(campaignName)}
                fill={getCampaignSourceColor(campaignName)}
                fillOpacity={0.7}
                name={campaignName}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
        {campaignKeys.map((campaignName) => (
          <div key={campaignName} className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-1.5"
              style={{ backgroundColor: getCampaignSourceColor(campaignName) }}
            ></span>
            <span className="text-gray-600">{campaignName}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 