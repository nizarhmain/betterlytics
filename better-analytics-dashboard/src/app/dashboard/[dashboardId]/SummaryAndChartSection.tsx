"use client";
import { useState, useCallback, useMemo } from "react";
import SummaryCard from "@/components/SummaryCard";
import InteractiveChart from "@/components/InteractiveChart";
import { useSuspenseQuery } from '@tanstack/react-query';
import { formatDuration } from "@/utils/dateFormatters";
import { 
  fetchSummaryStatsAction, 
  fetchUniqueVisitorsAction,
  fetchTotalPageViewsAction,
  fetchSessionMetricsAction,
} from "@/app/actions";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
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

export default function SummaryAndChartSection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate, granularity } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('visitors');

  const { data: summary } = useSuspenseQuery({
    queryKey: ['summaryStatsWithCharts', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchSummaryStatsAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: visitorsData } = useSuspenseQuery({
    queryKey: ['visitors', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchUniqueVisitorsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const { data: pageviewsData } = useSuspenseQuery({
    queryKey: ['pageviews', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchTotalPageViewsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const { data: sessionMetricsData } = useSuspenseQuery({
    queryKey: ['sessionMetrics', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchSessionMetricsAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  const handleMetricChange = useCallback((metric: ActiveMetric) => {
    setActiveMetric(metric);
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Unique Visitors"
          value={summary.uniqueVisitors.toLocaleString()}
          rawChartData={summary.visitorsChartData}
          valueField="unique_visitors"
          chartColor="var(--chart-1)"
          isActive={activeMetric === 'visitors'}
          onClick={() => handleMetricChange('visitors')}
        />
        <SummaryCard
          title="Total Pageviews"
          value={summary.pageviews.toLocaleString()}
          rawChartData={summary.pageviewsChartData}
          valueField="views"
          chartColor="var(--chart-2)"
          isActive={activeMetric === 'pageviews'}
          onClick={() => handleMetricChange('pageviews')}
        />
        <SummaryCard
          title="Bounce Rate"
          value={summary.bounceRate !== undefined ? `${summary.bounceRate}%` : '0%'}
          rawChartData={summary.bounceRateChartData}
          valueField="bounce_rate"
          chartColor="var(--chart-3)"
          isActive={activeMetric === 'bounceRate'}
          onClick={() => handleMetricChange('bounceRate')}
        />
        <SummaryCard
          title="Avg. Visit Duration"
          value={formatDuration(summary.avgVisitDuration)}
          rawChartData={summary.avgVisitDurationChartData}
          valueField="avg_visit_duration"
          chartColor="var(--chart-4)"
          isActive={activeMetric === 'avgDuration'}
          onClick={() => handleMetricChange('avgDuration')}
        />
      </div>

      <InteractiveChart
        title={currentMetricConfig.title}
        data={chartData}
        valueField={currentMetricConfig.valueField}
        color={currentMetricConfig.color}
        formatValue={currentMetricConfig.formatValue}
      />
    </div>
  );
} 