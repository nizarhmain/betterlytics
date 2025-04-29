'use client';

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import PagesTable from "@/components/analytics/PagesTable";
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";
import { fetchSummaryStatsAction, fetchPageViewsAction } from '../actions';
import { PageAnalytics, SummaryStats } from '@/types/analytics';

export default function PagesClient() {
  const [range, setRange] = useState<TimeRangeValue>("7d");
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

  const { data: summary, isLoading: summaryLoading } = useQuery<SummaryStats>({
    queryKey: ['summaryStats', 'default-site', startDate, endDate],
    queryFn: () => fetchSummaryStatsAction('default-site', startDate, endDate),
  });

  const { data: pageViews, isLoading: pageViewsLoading } = useQuery({
    queryKey: ['pageViews', 'default-site', startDate, endDate],
    queryFn: () => fetchPageViewsAction('default-site', startDate, endDate, 'day'),
  });

  const pagesData = useMemo(() => {
    if (!pageViews) return [];
    
    const pageMap = new Map<string, PageAnalytics>();
    
    pageViews.forEach(view => {
      if (!pageMap.has(view.url)) {
        pageMap.set(view.url, {
          path: view.url,
          title: view.url.split('/').pop() || 'Homepage',
          visitors: 0,
          pageviews: 0,
          bounceRate: 0,
          avgTime: '0s',
          conversion: 0,
        });
      }
      const page = pageMap.get(view.url)!;
      page.pageviews += view.views;
    });

    return Array.from(pageMap.values());
  }, [pageViews]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pages</h1>
          <p className="text-sm text-gray-500">Analytics and insights for your website</p>
        </div>
        <div className="relative inline-block text-left">
          <select
            className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={range}
            onChange={e => setRange(e.target.value as TimeRangeValue)}
          >
            {TIME_RANGE_PRESETS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Pages"
          value={summaryLoading ? '...' : String(pagesData.length)}
          changeText=""
        />
        <SummaryCard
          title="Avg. Page Views"
          value={summaryLoading ? '...' : summary?.pageviews ? Math.round(summary.pageviews / pagesData.length).toLocaleString() : '0'}
          changeText=""
        />
        <SummaryCard
          title="Avg. Time on Page"
          value={summaryLoading ? '...' : summary?.avgVisitDuration ? `${Math.round(summary.avgVisitDuration / 60)}m ${summary.avgVisitDuration % 60}s` : '0s'}
          changeText=""
        />
        <SummaryCard
          title="Bounce Rate"
          value={summaryLoading ? '...' : summary?.bounceRate ? `${summary.bounceRate}%` : '0%'}
          changeText=""
        />
      </div>

      <PagesTable data={pagesData} />
    </div>
  );
} 