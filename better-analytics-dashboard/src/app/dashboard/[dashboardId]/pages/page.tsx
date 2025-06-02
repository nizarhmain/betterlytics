import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { fetchSummaryStatsAction, fetchPageAnalyticsAction } from '@/app/actions';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { SummaryCardsSkeleton, TableSkeleton } from '@/components/skeleton';
import PagesSummarySection from '@/app/dashboard/[dashboardId]/pages/PagesSummarySection';
import PagesTableSection from './PagesTableSection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type PagesPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function PagesPage({ params, searchParams }: PagesPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate } = await parsePagesSearchParams(searchParams);

  const summaryStatsPromise = fetchSummaryStatsAction(dashboardId, startDate, endDate, []);
  const pageAnalyticsPromise = fetchPageAnalyticsAction(dashboardId, startDate, endDate, []);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Pages</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense fallback={<SummaryCardsSkeleton />}>
          <PagesSummarySection
            summaryStatsPromise={summaryStatsPromise}
            pageAnalyticsPromise={pageAnalyticsPromise}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <PagesTableSection pageAnalyticsPromise={pageAnalyticsPromise} />
        </Suspense>
      </div>
    </div>
  );
}

const parsePagesSearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
