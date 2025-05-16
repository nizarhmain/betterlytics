'use client';

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";
import { fetchCampaignPerformanceAction, fetchCampaignSourceBreakdownAction } from "@/app/actions/campaigns";
import { CampaignPerformance, CampaignSourceBreakdownItem } from "@/entities/campaign";
import CampaignPerformanceTable from "@/components/analytics/CampaignPerformanceTable";
import CampaignSourceChart from "@/components/analytics/CampaignSourceChart";

export default function CampaignClient() {
  const [range, setRange] = useState<TimeRangeValue>("7d");
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

  const { data: campaignPerformance = [], isLoading: campaignPerformanceLoading } = useQuery<CampaignPerformance[]>({
    queryKey: ['campaignPerformance', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignPerformanceAction('default-site', startDate, endDate),
  });

  const { data: sourceBreakdown = [], isLoading: sourceBreakdownLoading } = useQuery<CampaignSourceBreakdownItem[]>({
    queryKey: ['campaignSourceBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignSourceBreakdownAction('default-site', startDate, endDate),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Campaigns</h1>
          <p className="text-sm text-gray-500">Campaign performance analytics and insights</p>
        </div>
        <div className="relative inline-block text-left">
          <select
            className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={range}
            onChange={e => setRange(e.target.value as TimeRangeValue)}
          >
            {TIME_RANGE_PRESETS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <CampaignPerformanceTable 
        data={campaignPerformance} 
        isLoading={campaignPerformanceLoading} 
      />

      <CampaignSourceChart 
        data={sourceBreakdown} 
        isLoading={sourceBreakdownLoading} 
      />
    </div>
  );
} 