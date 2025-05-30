'use client';

import { useQuery } from '@tanstack/react-query';
import SummaryCard from '@/components/SummaryCard';
import DeviceTypeChart from '@/components/analytics/DeviceTypeChart';
import BrowserTable from '@/components/analytics/BrowserTable';
import OperatingSystemTable from '@/components/analytics/OperatingSystemTable';
import DeviceUsageTrendChart from '@/components/charts/DeviceUsageTrendChart';
import { DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from '@/entities/devices';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import QueryFiltersSelector from '@/components/filters/QueryFiltersSelector';
import {
  fetchDeviceSummaryAction,
  fetchDeviceTypeBreakdownAction,
  fetchBrowserBreakdownAction,
  fetchOperatingSystemBreakdownAction,
  fetchDeviceUsageTrendAction,
} from '@/app/actions';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function DevicesClient() {
  const dashboardId = useDashboardId();
  const { startDate, endDate, granularity } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  // Fetch device summary
  const { data: deviceSummary, isLoading: summaryLoading } = useQuery<DeviceSummary>({
    queryKey: ['deviceSummary', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceSummaryAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch device breakdown
  const { data: deviceBreakdown = [], isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch browser stats
  const { data: browserStats = [], isLoading: browserStatsLoading } = useQuery({
    queryKey: ['browserBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchBrowserBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch OS stats
  const { data: osStats = [], isLoading: osStatsLoading } = useQuery<OperatingSystemStats[]>({
    queryKey: ['osBreakdown', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchOperatingSystemBreakdownAction(dashboardId, startDate, endDate, queryFilters),
  });

  // Fetch device usage trend
  const { data: deviceUsageTrend = [], isLoading: deviceUsageTrendLoading } = useQuery<DeviceUsageTrendRow[]>({
    queryKey: ['deviceUsageTrend', dashboardId, startDate, endDate, granularity, queryFilters],
    queryFn: () => fetchDeviceUsageTrendAction(dashboardId, startDate, endDate, granularity, queryFilters),
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col justify-between gap-y-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-foreground mb-1 text-2xl font-bold'>Devices</h1>
          <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
        </div>
        <div className='flex flex-col justify-end gap-x-4 gap-y-1 lg:flex-row'>
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <SummaryCard
          title='Distinct Device Types'
          value={summaryLoading ? '...' : (deviceSummary?.distinctDeviceCount.toString() ?? '0')}
          changeText=''
        />
        <SummaryCard
          title='Most Popular Device'
          value={
            summaryLoading
              ? '...'
              : deviceSummary?.topDevice
                ? `${deviceSummary.topDevice.name} (${deviceSummary.topDevice.percentage}%)`
                : 'Unknown'
          }
          changeText=''
        />
        <SummaryCard
          title='Most Popular Operating System'
          value={
            deviceSummary?.topOs ? `${deviceSummary.topOs.name} (${deviceSummary.topOs.percentage}%)` : 'Unknown'
          }
          changeText=''
        />
        <SummaryCard
          title='Most Popular Browser'
          value={
            deviceSummary?.topBrowser
              ? `${deviceSummary.topBrowser.name} (${deviceSummary.topBrowser.percentage}%)`
              : 'Unknown'
          }
          changeText=''
        />
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='bg-card border-border rounded-lg border p-6 shadow'>
          <h2 className='text-foreground mb-1 text-lg font-bold'>Device Types</h2>
          <p className='text-muted-foreground mb-4 text-sm'>Visitors by device category</p>
          <DeviceTypeChart data={deviceBreakdown} isLoading={deviceBreakdownLoading} />
        </div>
        <div className='bg-card border-border rounded-lg border p-6 shadow'>
          <h2 className='text-foreground mb-1 text-lg font-bold'>Device Usage Trend</h2>
          <p className='text-muted-foreground mb-4 text-sm'>Visitor trends by device type</p>
          <DeviceUsageTrendChart data={deviceUsageTrend} loading={deviceUsageTrendLoading} />
        </div>
        <div className='bg-card border-border rounded-lg border p-6 shadow'>
          <h2 className='text-foreground mb-1 text-lg font-bold'>Top Operating Systems</h2>
          <p className='text-muted-foreground mb-4 text-sm'>Most common operating systems</p>
          <OperatingSystemTable data={osStats} isLoading={osStatsLoading} />
        </div>
        <div className='bg-card border-border rounded-lg border p-6 shadow'>
          <h2 className='text-foreground mb-1 text-lg font-bold'>Top Browsers</h2>
          <p className='text-muted-foreground mb-4 text-sm'>Most common browsers</p>
          <BrowserTable data={browserStats} isLoading={browserStatsLoading} />
        </div>
      </div>
    </div>
  );
}
