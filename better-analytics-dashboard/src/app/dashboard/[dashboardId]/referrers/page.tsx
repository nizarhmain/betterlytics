import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import {
  fetchReferrerSourceAggregationDataForSite,
  fetchReferrerSummaryDataForSite,
  fetchReferrerTableDataForSite,
  fetchReferrerTrafficTrendBySourceDataForSite,
} from '@/app/actions';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { SummaryCardsSkeleton, TableSkeleton, ChartSkeleton } from '@/components/skeleton';
import ReferrersSummarySection from './ReferrersSummarySection';
import ReferrersChartsSection from './ReferrersChartsSection';
import ReferrersTableSection from './ReferrersTableSection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type ReferrersPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function ReferrersPage({ params, searchParams }: ReferrersPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate, granularity } = await parseReferrersSearchParams(searchParams);

  const referrerSummaryPromise = fetchReferrerSummaryDataForSite(dashboardId, startDate, endDate);
  const distributionPromise = fetchReferrerSourceAggregationDataForSite(dashboardId, startDate, endDate);
  const trendPromise = fetchReferrerTrafficTrendBySourceDataForSite(dashboardId, startDate, endDate, granularity);
  const tablePromise = fetchReferrerTableDataForSite(dashboardId, startDate, endDate);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Referrers</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense fallback={<SummaryCardsSkeleton count={3} />}>
          <ReferrersSummarySection referrerSummaryPromise={referrerSummaryPromise} />
        </Suspense>

        <Suspense
          fallback={
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          }
        >
          <ReferrersChartsSection distributionPromise={distributionPromise} trendPromise={trendPromise} />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <ReferrersTableSection referrerTablePromise={tablePromise} />
        </Suspense>
      </div>
    </div>
  );
}

const parseReferrersSearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
