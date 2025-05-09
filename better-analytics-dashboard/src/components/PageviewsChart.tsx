"use client";
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchPageViewsAction } from '@/app/actions/overview';
import { DailyPageViewRow } from "@/entities/pageviews";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { timeFormat } from "d3-time-format";
import { scaleTime } from "d3-scale";
import { utcMinute, utcHour, utcDay } from "d3-time";
import { GranularityRangeValues } from '@/utils/granularityRanges';

interface PageviewsChartProps {
  siteId: string;
  startDate: string;
  endDate: string;
  granularity: GranularityRangeValues;
}

export default function PageviewsChart({ siteId, startDate, endDate, granularity }: PageviewsChartProps) {
  const { data = [], isLoading } = useQuery<DailyPageViewRow[]>({
    queryKey: ['pageViews', siteId, startDate, endDate, granularity],
    queryFn: () => fetchPageViewsAction(siteId, startDate, endDate, granularity),
  });

  // Group by date - accumulates url views
  const groupedData = useMemo(() => {
    return data.reduce(
      (group, row) => {
        const key = new Date(row.date).valueOf().toString();
        const acc = group[key] ?? 0;
        return { ...group, [key]: acc + row.views }
      }, {} as Record<string, number>
    )
  }, [data]);

  // Calculates upper and lower bound of time and views
  const timeSeries = useMemo(() => {
    const dates = Object.keys(groupedData).map((date) => +date);
    const views = Object.values(groupedData);
    return {
        minTime: Math.min(...dates),
        maxTime: Math.max(...dates),
        minValue: Math.min(...views),
        maxValue: Math.max(...views)
      }
    },
    [groupedData]
  );

  // Generate scale for graph
  const scale = useMemo(
    () => scaleTime(
      [timeSeries.minTime, timeSeries.maxTime],
      [timeSeries.minValue, timeSeries.maxValue]
    ),
    [timeSeries]
  );

  // Find the time interval of input based on specified granularity
  const intervalFunc = useMemo(() => {
    return {
      'day': utcDay,
      'hour': utcHour,
      'minute': utcMinute,
    }[granularity];
  }, [granularity])

  // Generate list of "ticks"/labels to be added on the x-axis 
  const ticks = useMemo(() => {
    return scale.ticks(
      utcDay.every(1)!
    ) as unknown as number[]; // Recharts has incorrectly typed "ticks"
  }, [scale]);

  // Fill in the missing dates
  const chartData = useMemo(() => {
    const filled = [];
    // Iterate through each potential time frame
    for (
      let time = new Date(timeSeries.minTime);
          time <= new Date(timeSeries.maxTime);
          time = intervalFunc.offset(time, 1)
    ) {
      const key = time.valueOf().toString();
      // Add entry - either with data from group or default value of 0
      filled.push({
        date: +key,
        views: groupedData[key] ?? 0
      });
    }
    return filled;
  }, [intervalFunc, groupedData, timeSeries]);

  // Render tooltip based on granularity
  const tooltipLabelFormatter = useMemo(() => {
    return {
      'day': timeFormat("%B %d, %Y"),
      'hour': timeFormat("%H:%M, %B %d, %Y"),
      'minute': timeFormat("%H:%M, %B %d, %Y"),
    }[granularity];
  }, [granularity])

  if (isLoading) return <div>Loading chart...</div>;
  if (data.length === 0) return <div>No data available.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-gray-900">Pageviews</h2>
        <p className="text-sm text-gray-500">Total pageviews over time</p>
      </div>
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
            />
            <Line type="monotoneX" dataKey="views" stroke={`#a78bfa`} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 