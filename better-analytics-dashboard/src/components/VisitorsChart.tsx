"use client";
import { useQuery } from '@tanstack/react-query';
import { fetchDailyUniqueVisitorsAction } from '@/app/dashboard/actions';
import { DailyUniqueVisitorsRow } from "@/entities/pageviews";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface VisitorsChartProps {
  siteId: string;
}

export default function VisitorsChart({ siteId }: VisitorsChartProps) {
  const { data = [], isLoading } = useQuery<DailyUniqueVisitorsRow[]>({
    queryKey: ['dailyUniqueVisitors', siteId],
    queryFn: () => fetchDailyUniqueVisitorsAction(siteId),
  });

  const chartData = data.map(row => ({ date: row.date, unique_visitors: row.unique_visitors }));

  if (isLoading) return <div>Loading chart...</div>;
  if (data.length === 0) return <div>No data available.</div>;

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="unique_visitors" stroke="#06b6d4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 