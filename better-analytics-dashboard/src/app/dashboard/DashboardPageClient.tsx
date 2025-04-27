"use client";
import SummaryCard from "@/components/SummaryCard";
import PageviewsChart from "@/components/PageviewsChart";
import VisitorsChart from "@/components/VisitorsChart";
import { useState } from "react";
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";

export default function DashboardPageClient({ session }: { session: any }) {
  const [range, setRange] = useState<TimeRangeValue>("7d");
  const { startDate, endDate } = getRangeForValue(range);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-end mb-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Unique Visitors"
            value="24,589"
            changeText="↑ 12.5% vs. previous period"
            changeColor="text-green-600"
          />
          <SummaryCard
            title="Total Pageviews"
            value="78,245"
            changeText="↓ 2.3% vs. previous period"
            changeColor="text-red-600"
          />
          <SummaryCard
            title="Bounce Rate"
            value="42.3%"
            changeText="↓ 5.1% vs. previous period"
            changeColor="text-green-600"
          />
          <SummaryCard
            title="Avg. Visit Duration"
            value="2m 13s"
            changeText="↑ 8.7% vs. previous period"
            changeColor="text-green-600"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <VisitorsChart siteId="default-site" startDate={startDate} endDate={endDate} />
          <PageviewsChart siteId="default-site" startDate={startDate} endDate={endDate} />
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">
            Welcome, {session.user?.name || "User"}! You are logged in as an {session.user?.role || "user"}.
          </p>
        </div>
      </div>
    </div>
  );
} 