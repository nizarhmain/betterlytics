"use client";
import { useState, useCallback, useMemo, use } from "react";
import SummaryCard from "@/components/SummaryCard";
import InteractiveChart from "@/components/InteractiveChart";
import { formatDuration } from "@/utils/dateFormatters";
import { 
  fetchSummaryStatsAction, 
  fetchUniqueVisitorsAction,
  fetchTotalPageViewsAction,
  fetchSessionMetricsAction,
} from "@/app/actions";

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

type SummaryAndChartSectionProps = {
  data: Promise<[
    Awaited<ReturnType<typeof fetchSummaryStatsAction>>,
    visitorsData: Awaited<ReturnType<typeof fetchUniqueVisitorsAction>>,
    pageviewsData: Awaited<ReturnType<typeof fetchTotalPageViewsAction>>,
    sessionMetricsData: Awaited<ReturnType<typeof fetchSessionMetricsAction>>,
  ]>
};

export default function SummaryAndChartSection({ data }: SummaryAndChartSectionProps) {
  
  const [ summary, visitorsData, pageviewsData, sessionMetricsData ] = use(data);

  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('visitors');
  
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