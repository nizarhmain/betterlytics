import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { getWorldMapData } from '@/app/actions/geography';
import GeographySection from '@/app/dashboard/[dashboardId]/geography/GeographySection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import { BAFilterSearchParams } from '@/utils/filterSearchParams';

type GeographyPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ filters: string }>;
};

export default async function GeographyPage({ params, searchParams }: GeographyPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate, queryFilters } = await BAFilterSearchParams.decodeFromParams(searchParams);

  const worldMapPromise = getWorldMapData(dashboardId, { startDate, endDate, queryFilters });

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

      <div className='absolute top-4 right-4 z-20'>
        <div className='bg-card flex gap-4 rounded-md p-2 shadow-md'>
          <DashboardFilters />
        </div>
      </div>
    </div>
  );
}
