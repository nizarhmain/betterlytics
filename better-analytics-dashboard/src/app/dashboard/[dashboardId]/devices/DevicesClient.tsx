'use client';

import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import DeviceTypeChart from "@/components/analytics/DeviceTypeChart";
import BrowserTable from "@/components/analytics/BrowserTable";
import OperatingSystemTable from "@/components/analytics/OperatingSystemTable";
import DeviceUsageTrendChart from "@/components/charts/DeviceUsageTrendChart";
import { DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import QueryFiltersSelector from '@/components/filters/QueryFiltersSelector';
import { actions } from '@/app/actions/dashboard';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function DevicesClient() {
  const dashboardId = useDashboardId();
  const { startDate, endDate, granularity } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  // Fetch device summary
  const { data: deviceSummary, isLoading: summaryLoading } = useQuery<DeviceSummary>({
    queryKey: ['deviceSummary', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => actions.fetchDeviceSummaryAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch device breakdown
  const { data: deviceBreakdown = [], isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => actions.fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch browser stats
  const { data: browserStats = [], isLoading: browserStatsLoading } = useQuery({
    queryKey: ['browserBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => actions.fetchBrowserBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch OS stats
  const { data: osStats = [], isLoading: osStatsLoading } = useQuery<OperatingSystemStats[]>({
    queryKey: ['osBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => actions.fetchOperatingSystemBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch device usage trend
  const { data: deviceUsageTrend = [], isLoading: deviceUsageTrendLoading } = useQuery<DeviceUsageTrendRow[]>({
    queryKey: ['deviceUsageTrend', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => actions.fetchDeviceUsageTrendAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Devices</h1>
          <p className="text-sm text-muted-foreground">Analytics and insights for your website</p>
        </div>
        <div className="flex justify-end gap-4">
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <SummaryCard
          title="Distinct Device Types"
          value={summaryLoading ? '...' : 
            deviceSummary?.distinctDeviceCount.toString() ?? '0'}
          changeText=""
        />
        <SummaryCard
          title="Most Popular Device"
          value={summaryLoading ? '...' : 
            deviceSummary?.topDevice ? 
            `${deviceSummary.topDevice.name} (${deviceSummary.topDevice.percentage}%)` : 
            'Unknown'}
          changeText=""
        />
        <SummaryCard
          title="Most Popular Operating System"
          value={deviceSummary?.topOs ? 
            `${deviceSummary.topOs.name} (${deviceSummary.topOs.percentage}%)` : 
            'Unknown'}
          changeText=""
        />
        <SummaryCard
          title="Most Popular Browser"
          value={deviceSummary?.topBrowser ? 
            `${deviceSummary.topBrowser.name} (${deviceSummary.topBrowser.percentage}%)` : 
            'Unknown'}
          changeText=""
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Device Types</h2>
          <p className="text-sm text-muted-foreground mb-4">Visitors by device category</p>
          <DeviceTypeChart 
            data={deviceBreakdown} 
            isLoading={deviceBreakdownLoading} 
          />
        </div>
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Device Usage Trend</h2>
          <p className="text-sm text-muted-foreground mb-4">Visitor trends by device type</p>
          <DeviceUsageTrendChart 
            data={deviceUsageTrend} 
            loading={deviceUsageTrendLoading} 
          />
        </div>
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Top Operating Systems</h2>
          <p className="text-sm text-muted-foreground mb-4">Most common operating systems</p>
          <OperatingSystemTable 
            data={osStats} 
            isLoading={osStatsLoading} 
          />
        </div>
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Top Browsers</h2>
          <p className="text-sm text-muted-foreground mb-4">Most common browsers</p>
          <BrowserTable 
            data={browserStats} 
            isLoading={browserStatsLoading} 
          />
        </div>
      </div>
    </div>
  );
} 