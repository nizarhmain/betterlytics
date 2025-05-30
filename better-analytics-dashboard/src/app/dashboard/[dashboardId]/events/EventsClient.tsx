'use client';

import { useQuery } from '@tanstack/react-query';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import { EventTypeRow } from '@/entities/events';
import { fetchCustomEventsOverviewAction } from '@/app/actions/events';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { EventsTable } from '@/components/events/EventsTable';
import { EventLog } from '@/components/events/EventLog';
import QueryFiltersSelector from '@/components/filters/QueryFiltersSelector';

export default function EventsClient() {
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();
  const dashboardId = useDashboardId();

  const { data: events = [], isLoading } = useQuery<EventTypeRow[]>({
    queryKey: ['customEvents', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchCustomEventsOverviewAction(dashboardId, startDate, endDate, queryFilters),
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col justify-between gap-y-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-foreground mb-1 text-2xl font-bold'>Events</h1>
          <p className='text-muted-foreground text-sm'>Analytics and insights for your custom events</p>
        </div>
        <div className='flex flex-col justify-end gap-x-4 gap-y-1 lg:flex-row'>
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>
      </div>

      <EventsTable data={events} isLoading={isLoading} />

      <EventLog />
    </div>
  );
}
