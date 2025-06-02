import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { fetchUserJourneyAction } from '@/app/actions/userJourney';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { Spinner } from '@/components/ui/spinner';
import UserJourneySection from '@/app/dashboard/[dashboardId]/user-journey/UserJourneySection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type UserJourneyPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{
    startDate?: Date;
    endDate?: Date;
    granularity?: string;
    numberOfSteps?: string;
    numberOfJourneys?: string;
  }>;
};

export default async function UserJourneyPage({ params, searchParams }: UserJourneyPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate, numberOfSteps, numberOfJourneys } = await parseUserJourneySearchParams(searchParams);

  const userJourneyPromise = fetchUserJourneyAction(
    dashboardId,
    startDate,
    endDate,
    numberOfSteps,
    numberOfJourneys,
    [],
  );

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>User Journey</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense
          fallback={
            <div className='relative min-h-[400px]'>
              <div className='bg-background/70 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm'>
                <div className='flex flex-col items-center'>
                  <Spinner size='lg' className='mb-2' />
                  <p className='text-muted-foreground'>Loading journey data...</p>
                </div>
              </div>
            </div>
          }
        >
          <UserJourneySection userJourneyPromise={userJourneyPromise} />
        </Suspense>
      </div>
    </div>
  );
}

// TODO: We need to likely also include steps and number of journey in the search params
const parseUserJourneySearchParams = async (
  searchParams: Promise<{
    startDate?: Date;
    endDate?: Date;
    granularity?: string;
    numberOfSteps?: string;
    numberOfJourneys?: string;
  }>,
) => {
  const {
    startDate: startDateStr,
    endDate: endDateStr,
    granularity: granularityStr,
    numberOfSteps: numberOfStepsStr,
    numberOfJourneys: numberOfJourneysStr,
  } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  const numberOfSteps = parseInt(numberOfStepsStr ?? '3', 10);
  const numberOfJourneys = parseInt(numberOfJourneysStr ?? '10', 10);

  return { startDate, endDate, granularity, numberOfSteps, numberOfJourneys };
};
