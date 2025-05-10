'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ReferrerTrafficBySourceRow } from '@/entities/referrers';
import { getReferrerColor } from '@/utils/referrerColors';
import { useMemo } from 'react';
import { format } from 'date-fns';
import ReferrerLegend from './ReferrerLegend';

interface ReferrerTrafficTrendChartProps {
  data?: ReferrerTrafficBySourceRow[];
  loading?: boolean;
}

// Custom tooltip for better display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-lg rounded-md border border-gray-200">
        <p className="text-xs text-gray-500">{format(new Date(label), 'MMM dd, yyyy HH:mm')}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} className="text-sm text-gray-700" style={{ color: entry.color }}>
            {`${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Process raw data into a format suitable for the stacked area chart
const processDataForStackedArea = (data: ReferrerTrafficBySourceRow[]) => {
  // Group by date
  const groupedByDate = data.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { date };
    }
    
    acc[date][item.referrer_source] = item.count;
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by date
  return Object.values(groupedByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export default function ReferrerTrafficTrendChart({ data, loading = false }: ReferrerTrafficTrendChartProps) {
  // Process the data for the stacked area chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return processDataForStackedArea(data);
  }, [data]);

  // Get all unique referrer sources from the data
  const referrerSources = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return Array.from(new Set(data.map(item => item.referrer_source)));
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-center">
          <p className="text-gray-500 mb-1">No trend data available</p>
          <p className="text-xs text-gray-400">Try adjusting the time range or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
          />
          <YAxis
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend 
            content={<ReferrerLegend showPercentage={false} />} 
            verticalAlign="bottom" 
            wrapperStyle={{ paddingTop: '20px' }} 
          />
          
          {referrerSources.map((source) => (
            <Area
              key={source}
              type="monotone"
              dataKey={source}
              stackId="1"
              stroke={getReferrerColor(source)}
              fill={getReferrerColor(source)}
              fillOpacity={0.6}
              name={source}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 