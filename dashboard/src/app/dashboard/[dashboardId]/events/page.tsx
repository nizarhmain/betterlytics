import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { fetchCustomEventsOverviewAction } from '@/app/actions/events';
import { TableSkeleton } from '@/components/skeleton';
import EventsTableSection from './EventsTableSection';
import { EventLog } from '@/app/dashboard/[dashboardId]/events/EventLog';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import { BAFilterSearchParams } from '@/utils/filterSearchParams';

type EventsPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ filters: string }>;
};

export default async function EventsPage({ params, searchParams }: EventsPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate, queryFilters } = await BAFilterSearchParams.decodeFromParams(searchParams);

  const eventsPromise = fetchCustomEventsOverviewAction(dashboardId, startDate, endDate, queryFilters);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Events</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your custom events</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <EventsTableSection eventsPromise={eventsPromise} />
        </Suspense>

        <EventLog />
      </div>
    </div>
  );
}
