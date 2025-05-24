'use client';

import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import PagesTable from "@/components/analytics/PagesTable";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { SummaryStats } from '@/entities/stats';
import { fetchSummaryStatsAction, fetchPageAnalyticsAction } from "@/app/actions/authenticated";
import { PageAnalytics } from "@/entities/pages";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import QueryFiltersSelector from '@/components/filters/QueryFiltersSelector';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function PagesClient() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: summary, isLoading: summaryLoading } = useQuery<SummaryStats>({
    queryKey: ['summaryStats', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchSummaryStatsAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: pages = [], isLoading: pagesLoading } = useQuery<PageAnalytics[]>({
    queryKey: ['pageAnalytics', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchPageAnalyticsAction(dashboardId, startDate, endDate, queryFilters),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Pages</h1>
          <p className="text-sm text-muted-foreground">Analytics and insights for your website</p>
        </div>
        <div className="flex justify-end gap-4">
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Pages"
          value={pagesLoading ? '...' : String(pages.length)}
          changeText=""
        />
        <SummaryCard
          title="Avg. Page Views"
          value={pagesLoading ? '...' : 
            pages.length > 0 
              ? Math.round(pages.reduce((sum, p) => sum + p.pageviews, 0) / pages.length).toLocaleString()
              : '0'
          }
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

      <PagesTable data={pages} />
    </div>
  );
} 