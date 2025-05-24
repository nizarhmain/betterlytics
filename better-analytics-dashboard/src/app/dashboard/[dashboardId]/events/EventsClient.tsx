'use client';

import { useQuery } from '@tanstack/react-query';
import SummaryCard from "@/components/SummaryCard";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { EventTypeRow } from "@/entities/events";
import { actions } from "@/app/actions/dashboard";
import EventsTable from "@/components/analytics/EventsTypeTable";
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function EventsClient() {
  const { startDate, endDate } = useTimeRangeContext();
  const dashboardId = useDashboardId();

  const { data: events = [], isLoading: eventsLoading } = useQuery<EventTypeRow[]>({
    queryKey: ['customEvents', dashboardId, startDate, endDate],
    queryFn: () => actions.fetchCustomEventsOverviewAction(dashboardId, startDate, endDate)
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Events</h1>
          <p className="text-sm text-muted-foreground">Analytics and insights for your website</p>
        </div>
        <div className="flex justify-end gap-4">
          <TimeRangeSelector />
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