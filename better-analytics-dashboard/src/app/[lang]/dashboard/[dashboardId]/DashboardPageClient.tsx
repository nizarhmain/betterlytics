"use client";
import SummaryCard from "@/components/SummaryCard";
import PageviewsChart from "@/components/PageviewsChart";
import VisitorsChart from "@/components/VisitorsChart";
import TopPagesTable from '@/components/TopPagesTable';
import DeviceTypePieChart from '@/components/DeviceTypePieChart';
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useQuery } from '@tanstack/react-query';
import { formatDuration } from "@/utils/dateFormatters";
import { fetchDeviceTypeBreakdownAction, fetchSummaryStatsAction, fetchTopPagesAction } from "@/app/actions";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import QueryFiltersSelector from "@/components/filters/QueryFiltersSelector";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { useDictionary } from "@/contexts/DictionaryProvider";

export default function DashboardPageClient() {
  const dashboardId = useDashboardId();
  const { granularity, startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();
  const dict = useDictionary();  
  
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summaryStats', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchSummaryStatsAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: topPages, isLoading: topPagesLoading } = useQuery({
    queryKey: ['topPages', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchTopPagesAction(dashboardId, startDate, endDate, 5, queryFilters),
  });

  const { data: deviceBreakdown, isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-end mb-4 gap-4">
        <QueryFiltersSelector />
        <TimeRangeSelector />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title={dict.dashboard.client["Unique visitors"]}
          value={summaryLoading ? '...' : summary?.uniqueVisitors?.toLocaleString() ?? '0'}
          changeText=""
          changeColor="text-green-600"
        />
        <SummaryCard
          title={dict.dashboard.client["Total pageviews"]}
          value={summaryLoading ? '...' : summary?.pageviews?.toLocaleString() ?? '0'}
          changeText=""
          changeColor="text-red-600"
        />
        <SummaryCard
          title={dict.dashboard.client.bounceRate}
          value={summaryLoading ? '...' : summary?.bounceRate !== undefined ? `${summary.bounceRate}%` : '0%'}
          changeText=""
        />
        <SummaryCard
          title={dict.dashboard.client.avgVisitDuration}
          value={summaryLoading ? '...' : formatDuration(summary?.avgVisitDuration ?? 0)}
          changeText=""
          changeColor="text-green-600"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card rounded-lg p-6 border border-border shadow">
          <VisitorsChart startDate={startDate} endDate={endDate} granularity={granularity} queryFilters={queryFilters} />
        </div>
        <div className="bg-card rounded-lg p-6 border border-border shadow">
          <PageviewsChart startDate={startDate} endDate={endDate} granularity={granularity} queryFilters={queryFilters} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card rounded-lg p-6 border border-border shadow">
          {topPagesLoading ? (
            <div className="text-center p-8 text-muted-foreground">{dict.misc.loading}</div>
          ) : (
            <TopPagesTable pages={topPages ?? []} />
          )}
        </div>
        <div className="bg-card rounded-lg p-6 border border-border shadow">
          {deviceBreakdownLoading ? (
            <div className="text-center p-8 text-muted-foreground">{dict.misc.loading}</div>
          ) : (
            <DeviceTypePieChart breakdown={deviceBreakdown ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}

