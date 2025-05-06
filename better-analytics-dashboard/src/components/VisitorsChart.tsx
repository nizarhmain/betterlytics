"use client";
import { useQuery } from '@tanstack/react-query';
import { fetchUniqueVisitorsAction } from '@/app/actions/overview';
import { DailyUniqueVisitorsRow } from "@/entities/visitors";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getGroupingForRange, TimeGrouping } from '@/utils/timeRanges';
import { GranularityRangeValues } from '@/utils/granularityRanges';

interface VisitorsChartProps {
  siteId: string;
  startDate: string;
  endDate: string;
  granularity: GranularityRangeValues;
}

export default function VisitorsChart({ siteId, startDate, endDate, granularity }: VisitorsChartProps) {
  const { data = [], isLoading } = useQuery<DailyUniqueVisitorsRow[]>({
    queryKey: ['uniqueVisitors', siteId, startDate, endDate, granularity],
    queryFn: () => fetchUniqueVisitorsAction(siteId, startDate, endDate, granularity),
  });

  const chartData = data.map(row => ({ date: row.date, unique_visitors: row.unique_visitors }));

  if (isLoading) return <div>Loading chart...</div>;
  if (data.length === 0) return <div>No data available.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-gray-900">Visitors</h2>
        <p className="text-sm text-gray-500">Unique visitors over time</p>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip />
            <Line type="monotone" dataKey="unique_visitors" stroke="#06b6d4" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 