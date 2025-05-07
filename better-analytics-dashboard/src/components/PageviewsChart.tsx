"use client";
import { useQuery } from '@tanstack/react-query';
import { fetchPageViewsAction } from '@/app/actions/overview';
import { DailyPageViewRow } from "@/entities/pageviews";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

  const grouped: Record<string, Record<string, number>> = {};
  data.forEach(row => {
    if (!grouped[row.date]) grouped[row.date] = {};
    grouped[row.date][row.url] = row.views;
  });
  const chartData = Object.entries(grouped).map(([date, urls]) => ({ date, ...urls }));
  const urls = Array.from(new Set(data.map(row => row.url)));

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
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip />
            {urls.map((url) => (
              <Line key={url} type="monotone" dataKey={url} stroke={`#a78bfa`} strokeWidth={3} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 