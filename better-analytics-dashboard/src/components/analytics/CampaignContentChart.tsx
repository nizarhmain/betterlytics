'use client';

import React, { useMemo } from 'react';
import { CampaignContentBreakdownItem } from '@/entities/campaign';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCampaignSourceColor } from '@/utils/campaignColors';

interface CampaignContentChartProps {
  data: CampaignContentBreakdownItem[];
  isLoading: boolean;
}

export default function CampaignContentChart({ data, isLoading }: CampaignContentChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0);
    return data.map((item) => ({
      name: item.content,
      value: item.visitors,
      color: getCampaignSourceColor(item.content),
      percent: totalVisitors > 0 ? Math.round((item.visitors / totalVisitors) * 100) : 0,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No content breakdown data available for campaigns.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-md font-semibold text-gray-700 mb-1">Campaign Traffic by Content</h3>
      <div className="h-72 md:h-80 flex flex-col items-center mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string, props: any) => [`${value.toLocaleString()} visitors (${props.payload.percent}%)`, name]} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center">
              <span
                className="inline-block w-3 h-3 rounded-full mr-1.5"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-gray-600">{entry.name} ({entry.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 