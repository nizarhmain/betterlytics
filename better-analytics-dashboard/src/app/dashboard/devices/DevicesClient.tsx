'use client';

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import DeviceTypeChart from "@/components/analytics/DeviceTypeChart";
import BrowserTable from "@/components/analytics/BrowserTable";
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";
import { fetchDeviceTypeBreakdownAction, fetchDeviceSummaryAction } from "@/app/actions/devices";
import { fetchBrowserBreakdownAction } from "@/app/actions/devices";
import { DeviceSummary } from "@/entities/devices";

export default function DevicesClient() {
  const [range, setRange] = useState<TimeRangeValue>("7d");
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

  // Fetch device summary
  const { data: deviceSummary, isLoading: summaryLoading } = useQuery<DeviceSummary>({
    queryKey: ['deviceSummary', 'default-site', startDate, endDate],
    queryFn: () => fetchDeviceSummaryAction('default-site', startDate, endDate),
  });

  // Fetch device breakdown
  const { data: deviceBreakdown = [], isLoading: deviceBreakdownLoading } = useQuery({
    queryKey: ['deviceTypeBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchDeviceTypeBreakdownAction('default-site', startDate, endDate),
  });

  // Fetch browser stats
  const { data: browserStats = [], isLoading: browserStatsLoading } = useQuery({
    queryKey: ['browserBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchBrowserBreakdownAction('default-site', startDate, endDate),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Devices</h1>
          <p className="text-sm text-muted-foreground">Analytics and insights for your website</p>
        </div>
        <div className="relative inline-block text-left">
          <select
            className="bg-card border-input border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={range}
            onChange={e => setRange(e.target.value as TimeRangeValue)}
          >
            {TIME_RANGE_PRESETS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
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