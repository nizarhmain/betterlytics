import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { getWorldMapData } from '@/app/actions/geography';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import GeographySection from '@/app/dashboard/[dashboardId]/geography/GeographySection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type GeographyPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function GeographyPage({ params, searchParams }: GeographyPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate } = await parseGeographySearchParams(searchParams);

  const worldMapPromise = getWorldMapData(dashboardId, { startDate, endDate, queryFilters: [] });

  return (
    <div className='relative flex h-full w-full flex-col'>
      <Suspense
        fallback={
          <div className='bg-background/70 absolute inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm'>
            <div className='flex flex-col items-center'>
              <div className='border-accent border-t-primary mb-2 h-10 w-10 animate-spin rounded-full border-4'></div>
              <p className='text-foreground'>Loading visitor data...</p>
            </div>
          </div>
        }
      >
        <GeographySection worldMapPromise={worldMapPromise} />
      </Suspense>

      <div className='absolute top-4 right-4 z-[1001]'>
        <div className='bg-card flex gap-4 rounded-md p-2 shadow-md'>
          <DashboardFilters />
        </div>
      </div>
    </div>
  );
}

const parseGeographySearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
