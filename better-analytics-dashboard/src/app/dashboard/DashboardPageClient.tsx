"use client";
import SummaryCard from "@/components/SummaryCard";
import PageviewsChart from "@/components/PageviewsChart";
import VisitorsChart from "@/components/VisitorsChart";
import TopPagesTable from '@/components/TopPagesTable';
import DeviceTypePieChart from '@/components/DeviceTypePieChart';
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useQuery } from '@tanstack/react-query';
import { formatDuration } from "@/utils/dateFormatters";
import { fetchDeviceTypeBreakdownAction } from "@/app/actions/devices";
import { fetchSummaryStatsAction, fetchTopPagesAction } from "@/app/actions/overview";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";

export default function DashboardPageClient() {
  const { granularity, startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const siteId = 'default-site';

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summaryStats', siteId, startDate, endDate],
    queryFn: () => fetchSummaryStatsAction(siteId, startDate, endDate),
  });

  const { data: topPages, isLoading: topPagesLoading } = useQuery({
    queryKey: ['topPages', siteId, startDate, endDate, queryFilters],
    queryFn: () => fetchTopPagesAction(siteId, startDate, endDate, 5, queryFilters),
  });

  const { data: deviceBreakdown, isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', siteId, startDate, endDate],
    queryFn: () => fetchDeviceTypeBreakdownAction(siteId, startDate, endDate),
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-end mb-4 gap-4">
          <TimeRangeSelector />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Unique Visitors"
            value={summaryLoading ? '...' : summary?.uniqueVisitors?.toLocaleString() ?? '0'}
            changeText=""
            changeColor="text-green-600"
          />
          <SummaryCard
            title="Total Pageviews"
            value={summaryLoading ? '...' : summary?.pageviews?.toLocaleString() ?? '0'}
            changeText=""
            changeColor="text-red-600"
          />
          <SummaryCard
            title="Bounce Rate"
            value={summaryLoading ? '...' : summary?.bounceRate !== undefined ? `${summary.bounceRate}%` : '0%'}
            changeText=""
          />
          <SummaryCard
            title="Avg. Visit Duration"
            value={summaryLoading ? '...' : formatDuration(summary?.avgVisitDuration ?? 0)}
            changeText=""
            changeColor="text-green-600"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <VisitorsChart siteId={siteId} startDate={startDate} endDate={endDate} granularity={granularity} />
          <PageviewsChart siteId={siteId} startDate={startDate} endDate={endDate} granularity={granularity} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            {topPagesLoading || !topPages ? <div>Loading...</div> : <TopPagesTable pages={topPages ?? []} />}
          </div>
          <div>
            {deviceBreakdownLoading || !deviceBreakdown ? <div>Loading...</div> : <DeviceTypePieChart breakdown={deviceBreakdown ?? []} />}
          </div>
        </div>
      </div>
    </div>
  );
}

