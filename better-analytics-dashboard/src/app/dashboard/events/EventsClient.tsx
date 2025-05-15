'use client';

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import PagesTable from "@/components/analytics/PagesTable";
import { TIME_RANGE_PRESETS, getRangeForValue, TimeRangeValue } from "@/utils/timeRanges";
import { SummaryStats } from '@/entities/stats';
import { fetchSummaryStatsAction } from "@/app/actions/overview";
import { fetchPageAnalyticsAction } from "@/app/actions/pages";
import { PageAnalytics } from "@/entities/pages";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { EventTypeRow } from "@/entities/events";
import { fetchCustomEventsOverviewAction } from "@/app/actions/events";
import EventsTable from "@/components/analytics/EventsTypeTable";

export default function EventsClient() {
  const { range, setRange } = useTimeRangeContext();
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

  const { data: summary, isLoading: summaryLoading } = useQuery<SummaryStats>({
    queryKey: ['summaryStats', 'default-site', startDate, endDate],
    queryFn: () => fetchSummaryStatsAction('default-site', startDate, endDate),
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<EventTypeRow[]>({
    queryKey: ['customEvents', 'default-site', startDate, endDate],
    queryFn: () => fetchCustomEventsOverviewAction('default-site', startDate, endDate),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Events</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Events"
          value={eventsLoading ? '...' : String(events.length)}
          changeText=""
        />
        <SummaryCard
          title="Avg. Event invokes"
          value={eventsLoading ? '...' : 
            events.length > 0 
              ? Math.round(events.reduce((sum, e) => sum + e.count, 0) / events.length).toLocaleString()
              : '0'
          }
          changeText=""
        />
      </div>

      <EventsTable data={events} />
    </div>
  );
} 