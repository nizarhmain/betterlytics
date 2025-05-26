'use client';

import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { EventTypeRow } from "@/entities/events";
import { fetchCustomEventsOverviewAction } from "@/app/actions";
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { EventsTable } from '@/components/events/EventsTable';


export default function EventsClient() {
  const { startDate, endDate } = useTimeRangeContext();
  const dashboardId = useDashboardId();

  const { data: events = [], isLoading: eventsLoading } = useQuery<EventTypeRow[]>({
    queryKey: ['customEvents', dashboardId, startDate, endDate],
    queryFn: () => fetchCustomEventsOverviewAction(dashboardId, startDate, endDate)
  });

  const totalEvents = events.reduce((sum, e) => sum + e.count, 0);
  const avgEventsPerType = events.length > 0 ? Math.round(totalEvents / events.length) : 0;
  const mostPopularEvent = events.length > 0 ? events[0] : null;
  const eventDiversity = events.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Events</h1>
          <p className="text-sm text-muted-foreground">Analytics and insights for your custom events</p>
        </div>
        <div className="flex justify-end gap-4">
          <TimeRangeSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Events"
          value={eventsLoading ? '...' : totalEvents.toLocaleString()}
          changeText=""
        />
        <SummaryCard
          title="Event Types"
          value={eventsLoading ? '...' : String(eventDiversity)}
          changeText=""
        />
        <SummaryCard
          title="Avg. per Type"
          value={eventsLoading ? '...' : avgEventsPerType.toLocaleString()}
          changeText=""
        />
        <SummaryCard
          title="Most Popular"
          value={eventsLoading ? '...' : (mostPopularEvent?.event_name || 'None')}
          changeText={mostPopularEvent ? `${mostPopularEvent.count.toLocaleString()} events` : ''}
        />
      </div>

      <EventsTable data={events} />
    </div>
  );
} 