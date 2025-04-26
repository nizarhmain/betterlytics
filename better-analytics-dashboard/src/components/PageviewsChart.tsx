"use client";
import { useQuery } from '@tanstack/react-query';
import { fetchDailyPageViewsAction } from '@/app/dashboard/actions';
import { DailyPageViewRow } from "@/entities/pageviews";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PageviewsChartProps {
  siteId: string;
}

export default function PageviewsChart({ siteId }: PageviewsChartProps) {
  const { data = [], isLoading } = useQuery<DailyPageViewRow[]>({
    queryKey: ['dailyPageViews', siteId],
    queryFn: () => fetchDailyPageViewsAction(siteId),
  });

  // Group data by date, then by url
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
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {urls.map((url, idx) => (
            <Line key={url} type="monotone" dataKey={url} stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 