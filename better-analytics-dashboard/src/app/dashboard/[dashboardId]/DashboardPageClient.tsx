"use client";
import { useState, useMemo, useCallback } from "react";
import SummaryCard from "@/components/SummaryCard";
import InteractiveChart from "@/components/InteractiveChart";
import MultiProgressTable from '@/components/MultiProgressTable';
import DeviceTypePieChart from '@/components/DeviceTypePieChart';
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useQuery } from '@tanstack/react-query';
import { formatDuration } from "@/utils/dateFormatters";
import { Card, CardContent } from "@/components/ui/card";
import { 
  fetchDeviceTypeBreakdownAction, 
  fetchSummaryStatsAction, 
  fetchTopPagesAction,
  fetchTopEntryPagesAction,
  fetchTopExitPagesAction,
  fetchUniqueVisitorsAction,
  fetchTotalPageViewsAction,
  fetchSessionMetricsAction
} from "@/app/actions";
import { fetchBrowserBreakdownAction, fetchOperatingSystemBreakdownAction } from "@/app/actions/devices";
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
  const { startDate, endDate, granularity } = useTimeRangeContext();
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

  const { data: topEntryPages, isLoading: topEntryPagesLoading } = useQuery({
    queryKey: ['topEntryPages', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchTopEntryPagesAction(dashboardId, startDate, endDate, 5, queryFilters),
  });

  const { data: topExitPages, isLoading: topExitPagesLoading } = useQuery({
    queryKey: ['topExitPages', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchTopExitPagesAction(dashboardId, startDate, endDate, 5, queryFilters),
  });

  const { data: deviceBreakdown, isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: browserBreakdown, isLoading: browserBreakdownLoading } = useQuery({
    queryKey: ['browserBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchBrowserBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  const { data: osBreakdown, isLoading: osBreakdownLoading } = useQuery({
    queryKey: ['osBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchOperatingSystemBreakdownAction(dashboardId, startDate, endDate, queryFilters),
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
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        <div className="flex justify-end gap-4">
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <InteractiveChart
          title={currentMetricConfig.title}
          data={chartData}
          valueField={currentMetricConfig.valueField}
          color={currentMetricConfig.color}
          formatValue={currentMetricConfig.formatValue}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MultiProgressTable 
              title="Top Pages"
              defaultTab="pages"
              isLoading={topPagesLoading || topEntryPagesLoading || topExitPagesLoading}
              tabs={[
                {
                  key: "pages",
                  label: "Pages",
                  data: (topPages ?? []).map(page => ({ label: page.url, value: page.visitors })),
                  emptyMessage: "No page data available"
                },
                {
                  key: "entry",
                  label: "Entry Pages", 
                  data: (topEntryPages ?? []).map(page => ({ label: page.url, value: page.visitors })),
                  emptyMessage: "No entry pages data available"
                },
                {
                  key: "exit",
                  label: "Exit Pages",
                  data: (topExitPages ?? []).map(page => ({ label: page.url, value: page.visitors })),
                  emptyMessage: "No exit pages data available"
                }
              ]}
            />
          </div>
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
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:flex-[2]">
            <MultiProgressTable 
              title="Devices Breakdown"
              defaultTab="browsers"
              isLoading={browserBreakdownLoading || osBreakdownLoading || deviceBreakdownLoading}
              tabs={[
                {
                  key: "browsers",
                  label: "Browsers",
                  data: (browserBreakdown ?? []).map(item => ({ label: item.browser, value: item.visitors })),
                  emptyMessage: "No browser data available"
                },
                {
                  key: "devices",
                  label: "Devices", 
                  data: (deviceBreakdown ?? []).map(item => ({ label: item.device_type, value: item.visitors })),
                  emptyMessage: "No device data available"
                },
                {
                  key: "os",
                  label: "Operating Systems",
                  data: (osBreakdown ?? []).map(item => ({ label: item.os, value: item.visitors })),
                  emptyMessage: "No operating system data available"
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

