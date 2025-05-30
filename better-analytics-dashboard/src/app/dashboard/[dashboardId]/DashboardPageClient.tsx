"use client";
import { useState, useMemo, useCallback } from "react";
import SummaryCard from "@/components/SummaryCard";
import InteractiveChart from "@/components/InteractiveChart";
import TopPagesTable from '@/components/TopPagesTable';
import DeviceTypePieChart from '@/components/DeviceTypePieChart';
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useQuery } from '@tanstack/react-query';
import { formatDuration } from "@/utils/dateFormatters";
import { Card, CardContent } from "@/components/ui/card";
import { 
  fetchDeviceTypeBreakdownAction, 
  fetchSummaryStatsAction, 
  fetchTopPagesAction,
  fetchUniqueVisitorsAction,
  fetchTotalPageViewsAction,
  fetchSessionMetricsAction
} from "@/app/actions";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import QueryFiltersSelector from "@/components/filters/QueryFiltersSelector";
import { useDashboardId } from "@/hooks/use-dashboard-id";

type ActiveMetric = 'visitors' | 'pageviews' | 'bounceRate' | 'avgDuration';

interface MetricConfig {
  title: string;
  valueField: string;
  color: string;
  formatValue?: (value: number) => string;
}

const metricConfigs: Record<ActiveMetric, MetricConfig> = {
  visitors: {
    title: 'Unique Visitors',
    valueField: 'unique_visitors',
    color: 'var(--chart-1)',
  },
  pageviews: {
    title: 'Total Pageviews',
    valueField: 'views',
    color: 'var(--chart-2)',
  },
  bounceRate: {
    title: 'Bounce Rate',
    valueField: 'bounce_rate',
    color: 'var(--chart-3)',
    formatValue: (value: number) => `${value}%`,
  },
  avgDuration: {
    title: 'Average Visit Duration',
    valueField: 'avg_visit_duration',
    color: 'var(--chart-4)',
    formatValue: (value: number) => formatDuration(value),
  },
};

export default function DashboardPageClient() {
  const dashboardId = useDashboardId();
  const { granularity, startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('visitors');

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summaryStatsWithCharts', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchSummaryStatsAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: visitorsData } = useQuery({
    queryKey: ['visitors', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchUniqueVisitorsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const { data: pageviewsData } = useQuery({
    queryKey: ['pageviews', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchTotalPageViewsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const { data: sessionMetricsData } = useQuery({
    queryKey: ['sessionMetrics', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchSessionMetricsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const { data: topPages, isLoading: topPagesLoading } = useQuery({
    queryKey: ['topPages', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchTopPagesAction(dashboardId, startDate, endDate, 5, queryFilters),
  });

  const { data: deviceBreakdown, isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  const chartData = useMemo(() => {
    switch (activeMetric) {
      case 'visitors':
        return visitorsData || [];
      case 'pageviews':
        return pageviewsData || [];
      case 'bounceRate':
        return sessionMetricsData || [];
      case 'avgDuration':
        return sessionMetricsData || [];
      default:
        return [];
    }
  }, [activeMetric, visitorsData, pageviewsData, sessionMetricsData]);

  const currentMetricConfig = useMemo(() => metricConfigs[activeMetric], [activeMetric]);
  
  const handleMetricChange = useCallback((metric: ActiveMetric) => {
    setActiveMetric(metric);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-end mb-4 gap-4">
        <QueryFiltersSelector />
        <TimeRangeSelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Unique Visitors"
          value={summaryLoading ? '...' : summary?.uniqueVisitors?.toLocaleString() ?? '0'}
          rawChartData={summary?.visitorsChartData}
          valueField="unique_visitors"
          chartColor="var(--chart-1)"
          isLoading={summaryLoading}
          isActive={activeMetric === 'visitors'}
          onClick={() => handleMetricChange('visitors')}
        />
        <SummaryCard
          title="Total Pageviews"
          value={summaryLoading ? '...' : summary?.pageviews?.toLocaleString() ?? '0'}
          rawChartData={summary?.pageviewsChartData}
          valueField="views"
          chartColor="var(--chart-2)"
          isLoading={summaryLoading}
          isActive={activeMetric === 'pageviews'}
          onClick={() => handleMetricChange('pageviews')}
        />
        <SummaryCard
          title="Bounce Rate"
          value={summaryLoading ? '...' : summary?.bounceRate !== undefined ? `${summary.bounceRate}%` : '0%'}
          rawChartData={summary?.bounceRateChartData}
          valueField="bounce_rate"
          chartColor="var(--chart-3)"
          isLoading={summaryLoading}
          isActive={activeMetric === 'bounceRate'}
          onClick={() => handleMetricChange('bounceRate')}
        />
        <SummaryCard
          title="Avg. Visit Duration"
          value={summaryLoading ? '...' : formatDuration(summary?.avgVisitDuration ?? 0)}
          rawChartData={summary?.avgVisitDurationChartData}
          valueField="avg_visit_duration"
          chartColor="var(--chart-4)"
          isLoading={summaryLoading}
          isActive={activeMetric === 'avgDuration'}
          onClick={() => handleMetricChange('avgDuration')}
        />
      </div>
      
      <div className="mb-8">
        <InteractiveChart
          title={currentMetricConfig.title}
          data={chartData}
          valueField={currentMetricConfig.valueField}
          color={currentMetricConfig.color}
          formatValue={currentMetricConfig.formatValue}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6">
            {topPagesLoading ? (
              <div className="text-center p-8 text-muted-foreground">Loading...</div>
            ) : (
              <TopPagesTable pages={topPages ?? []} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {deviceBreakdownLoading ? (
              <div className="text-center p-8 text-muted-foreground">Loading...</div>
            ) : (
              <DeviceTypePieChart breakdown={deviceBreakdown ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

