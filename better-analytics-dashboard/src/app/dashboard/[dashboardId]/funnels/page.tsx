import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { fetchFunnelsAction } from '@/app/actions';
import FunnelsListSection from './FunnelsListSection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import { Skeleton } from '@/components/ui/skeleton';

type FunnelsPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function FunnelsPage({ params, searchParams }: FunnelsPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const funnelsPromise = fetchFunnelsAction(dashboardId);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Funnels</h1>
            <p className='text-muted-foreground text-sm'>Analyze user conversion paths</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense
          fallback={
            <div className='space-y-5'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='bg-card rounded-lg border p-6'>
                  <div className='mb-4 flex items-center gap-3'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                  <div className='grid grid-cols-4 gap-2'>
                    <Skeleton className='h-12 w-full' />
                    <Skeleton className='h-12 w-full' />
                    <Skeleton className='h-12 w-full' />
                    <Skeleton className='h-12 w-full' />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <FunnelsListSection funnelsPromise={funnelsPromise} dashboardId={dashboardId} />
        </Suspense>
      </div>
    </div>
  );
}
