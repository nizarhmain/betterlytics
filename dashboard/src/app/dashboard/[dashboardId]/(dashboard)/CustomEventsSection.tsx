"use client";

import MultiProgressTable from '@/components/MultiProgressTable';
import { fetchCustomEventsOverviewAction } from "@/app/actions/events";
import { use } from 'react';

type CustomEventsSectionProps = {
  customEventsPromise: ReturnType<typeof fetchCustomEventsOverviewAction>;
};

export default function CustomEventsSection({ customEventsPromise }: CustomEventsSectionProps) {
  const customEvents = use(customEventsPromise);

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