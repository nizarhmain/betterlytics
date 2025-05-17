'use client';

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";
import {
  fetchCampaignPerformanceAction,
  fetchCampaignSourceBreakdownAction,
  fetchCampaignVisitorTrendAction,
  fetchCampaignMediumBreakdownAction,
  fetchCampaignContentBreakdownAction,
  fetchCampaignTermBreakdownAction,
  fetchCampaignLandingPagePerformanceAction,
} from "@/app/actions/campaigns";
import {
  CampaignPerformance,
  CampaignSourceBreakdownItem,
  PivotedCampaignVisitorTrendItem,
  CampaignMediumBreakdownItem,
  CampaignContentBreakdownItem,
  CampaignTermBreakdownItem,
  CampaignLandingPagePerformanceItem,
} from "@/entities/campaign";
import CampaignPerformanceTable from "@/components/analytics/CampaignPerformanceTable";
import CampaignSourceChart from "@/components/analytics/CampaignSourceChart";
import CampaignVisitorTrendChart from "@/components/analytics/CampaignVisitorTrendChart";
import CampaignMediumChart from "@/components/analytics/CampaignMediumChart";
import CampaignSourceEngagementTable from "@/components/analytics/CampaignSourceEngagementTable";
import CampaignMediumEngagementTable from "@/components/analytics/CampaignMediumEngagementTable";
import CampaignContentChart from "@/components/analytics/CampaignContentChart";
import CampaignContentEngagementTable from "@/components/analytics/CampaignContentEngagementTable";
import CampaignTermChart from "@/components/analytics/CampaignTermChart";
import CampaignTermEngagementTable from "@/components/analytics/CampaignTermEngagementTable";
import CampaignLandingPagePerformanceTable from "@/components/analytics/CampaignLandingPagePerformanceTable";

type TabValue = "overview" | "utmBreakdowns" | "landingPages";

export default function CampaignClient() {
  const [range, setRange] = useState<TimeRangeValue>("7d");
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  const { data: campaignPerformance = [], isLoading: campaignPerformanceLoading } = useQuery<CampaignPerformance[]>({
    queryKey: ['campaignPerformance', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignPerformanceAction('default-site', startDate, endDate),
  });

  const { data: sourceBreakdown = [], isLoading: sourceBreakdownLoading } = useQuery<CampaignSourceBreakdownItem[]>({
    queryKey: ['campaignSourceBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignSourceBreakdownAction('default-site', startDate, endDate),
  });

  const { data: visitorTrend = [], isLoading: visitorTrendLoading } = useQuery<PivotedCampaignVisitorTrendItem[]>({
    queryKey: ['campaignVisitorTrend', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignVisitorTrendAction('default-site', startDate, endDate),
  });

  const { data: mediumBreakdown = [], isLoading: mediumBreakdownLoading } = useQuery<CampaignMediumBreakdownItem[]>({
    queryKey: ['campaignMediumBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignMediumBreakdownAction('default-site', startDate, endDate),
  });

  const { data: contentBreakdown = [], isLoading: contentBreakdownLoading } = useQuery<CampaignContentBreakdownItem[]>({
    queryKey: ['campaignContentBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignContentBreakdownAction('default-site', startDate, endDate),
  });

  const { data: termBreakdown = [], isLoading: termBreakdownLoading } = useQuery<CampaignTermBreakdownItem[]>({
    queryKey: ['campaignTermBreakdown', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignTermBreakdownAction('default-site', startDate, endDate),
  });

  const { data: landingPagePerformance = [], isLoading: landingPagePerformanceLoading } = useQuery<CampaignLandingPagePerformanceItem[]>({
    queryKey: ['campaignLandingPagePerformance', 'default-site', startDate, endDate],
    queryFn: () => fetchCampaignLandingPagePerformanceAction('default-site', startDate, endDate),
  });

  const renderTabButton = (tabValue: TabValue, label: string) => (
    <button
      key={tabValue}
      onClick={() => setActiveTab(tabValue)}
      className={`px-4 py-2 font-medium text-sm rounded-md focus:outline-none
        ${activeTab === tabValue
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
      {label}
    </button>
  );

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

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {renderTabButton("overview", "Overview")}
          {renderTabButton("utmBreakdowns", "UTM Breakdowns")}
          {renderTabButton("landingPages", "Landing Pages")}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <CampaignPerformanceTable
              data={campaignPerformance}
              isLoading={campaignPerformanceLoading}
            />
            <CampaignVisitorTrendChart
              data={visitorTrend}
              isLoading={visitorTrendLoading}
            />
          </div>
        )}

        {activeTab === "utmBreakdowns" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">UTM Source Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <CampaignSourceEngagementTable
                  data={sourceBreakdown}
                  isLoading={sourceBreakdownLoading}
                />
              </div>

              <CampaignSourceChart
                data={sourceBreakdown}
                isLoading={sourceBreakdownLoading}
              />
            </div>
            <hr className="my-6 border-gray-200"/>
            <h2 className="text-xl font-semibold text-gray-800">UTM Medium Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignMediumEngagementTable
                  data={mediumBreakdown}
                  isLoading={mediumBreakdownLoading}
                />
              </div>
              <CampaignMediumChart
                data={mediumBreakdown}
                isLoading={mediumBreakdownLoading}
              />
            </div>
            <hr className="my-6 border-gray-200"/>
            <h2 className="text-xl font-semibold text-gray-800">UTM Content Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignContentEngagementTable
                  data={contentBreakdown}
                  isLoading={contentBreakdownLoading}
                />
              </div>
              <CampaignContentChart
                data={contentBreakdown}
                isLoading={contentBreakdownLoading}
              />
            </div>
            <hr className="my-6 border-gray-200"/>
            <h2 className="text-xl font-semibold text-gray-800">UTM Term Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignTermEngagementTable
                  data={termBreakdown}
                  isLoading={termBreakdownLoading}
                />
              </div>
              <CampaignTermChart
                data={termBreakdown}
                isLoading={termBreakdownLoading}
              />
            </div>
          </div>
        )}

        {activeTab === "landingPages" && (
          <div>
            <CampaignLandingPagePerformanceTable
              data={landingPagePerformance}
              isLoading={landingPagePerformanceLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
} 