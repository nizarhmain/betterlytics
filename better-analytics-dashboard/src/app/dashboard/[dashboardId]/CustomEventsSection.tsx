"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchCustomEventsOverviewAction } from "@/app/actions/events";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function CustomEventsSection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: customEvents } = useSuspenseQuery({
    queryKey: ['customEvents', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchCustomEventsOverviewAction(dashboardId, startDate, endDate, queryFilters),
  });

  return (
    <MultiProgressTable 
      title="Custom Events"
      defaultTab="events"
      tabs={[
        {
          key: "events",
          label: "Events",
          data: customEvents.map(event => ({ label: event.event_name, value: event.count })),
          emptyMessage: "No custom events data available"
        }
      ]}
    />
  );
} 