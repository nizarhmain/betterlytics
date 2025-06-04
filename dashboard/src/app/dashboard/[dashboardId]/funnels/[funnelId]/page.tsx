import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { fetchFunnelDetailsAction } from '@/app/actions';
import FunnelStepsSection from './FunnelStepsSection';
import FunnelSummarySection from './FunnelSummarySection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import { SummaryCardsSkeleton } from '@/components/skeleton';
import { Skeleton } from '@/components/ui/skeleton';

type FunnelPageProps = {
  params: Promise<{ dashboardId: string; funnelId: string }>;
};

export default async function FunnelPage({ params }: FunnelPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId, funnelId } = await params;
  const funnelPromise = fetchFunnelDetailsAction(dashboardId, funnelId);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Funnel Analysis</h1>
            <p className='text-muted-foreground text-sm'>Detailed funnel conversion analysis</p>
          </div>
          <DashboardFilters />
        </div>

        <div className='bg-card grid gap-6 rounded-md border p-5 lg:grid-cols-3'>
          <div className='col-span-3 lg:col-span-2'>
            <Suspense
              fallback={
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='space-y-3'>
                      <div className='flex justify-between'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-16' />
                      </div>
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-6 w-full' />
                    </div>
                  ))}
                </div>
              }
            >
              <FunnelStepsSection funnelPromise={funnelPromise} />
            </Suspense>
          </div>

          <div className='col-span-3 lg:col-span-1 lg:border-l lg:pl-6'>
            <Suspense fallback={<SummaryCardsSkeleton count={4} />}>
              <FunnelSummarySection funnelPromise={funnelPromise} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
