"use client";

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchPageTrafficTimeSeriesAction } from '@/app/actions/pages';
import { TotalPageViewsRow } from "@/entities/pageviews";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { timeFormat } from "d3-time-format";
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { useFragmentedGranularityTimeSeriesLineChart } from '@/hooks/useFragmentedGranularityTimeSeriesLineChart';

interface PageTrafficChartProps {
  siteId: string;
  path: string;
  startDate: string;
  endDate: string;
  granularity: GranularityRangeValues;
}

export default function PageTrafficChart({ siteId, path, startDate, endDate, granularity }: PageTrafficChartProps) {
  const { data = [] as TotalPageViewsRow[], isLoading } = useQuery<TotalPageViewsRow[]>({
    queryKey: ['pageTraffic', siteId, path, startDate, endDate, granularity],
    queryFn: () => fetchPageTrafficTimeSeriesAction(siteId, path, startDate, endDate, granularity),
  });

  const timeSeriesProps = useMemo(() => {
    return {
      dataKey: 'views',
      data: data,
      granularity
    } as const;
  }, [data, granularity]);

  const {
    chartData,
    tooltipLabelFormatter,
    scale,
    ticks
  } = useFragmentedGranularityTimeSeriesLineChart(timeSeriesProps);

  if (isLoading) return (
    <div className="h-80 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-3 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
  if (data.length === 0) return (
    <div className="h-80 flex items-center justify-center text-gray-500">
      No data available
    </div>
  );

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            type='number'
            ticks={ticks}
            domain={["dataMin", "dataMax"]}
            scale={scale}
            tickFormatter={timeFormat("%b %d")}
            tick={{ textAnchor: "middle", fill: '#64748b', fontSize: 12 }}
            axisLine={false} tickLine={false}
          />
          <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            labelFormatter={tooltipLabelFormatter}
            formatter={(value) => [value, "Views"]}
          />
          <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 