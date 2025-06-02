import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import {
  fetchDeviceSummaryAction,
  fetchDeviceTypeBreakdownAction,
  fetchBrowserBreakdownAction,
  fetchOperatingSystemBreakdownAction,
  fetchDeviceUsageTrendAction,
} from '@/app/actions';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { SummaryCardsSkeleton, TableSkeleton, ChartSkeleton } from '@/components/skeleton';
import DevicesSummarySection from './DevicesSummarySection';
import DevicesChartsSection from './DevicesChartsSection';
import DevicesTablesSection from './DevicesTablesSection';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type DevicesPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function DevicesPage({ params, searchParams }: DevicesPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate, granularity } = await parseDevicesSearchParams(searchParams);

  const deviceSummaryPromise = fetchDeviceSummaryAction(dashboardId, startDate, endDate, []);
  const deviceBreakdownPromise = fetchDeviceTypeBreakdownAction(dashboardId, startDate, endDate, []);
  const browserStatsPromise = fetchBrowserBreakdownAction(dashboardId, startDate, endDate, []);
  const osStatsPromise = fetchOperatingSystemBreakdownAction(dashboardId, startDate, endDate, []);
  const deviceUsageTrendPromise = fetchDeviceUsageTrendAction(dashboardId, startDate, endDate, granularity, []);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Devices</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
          </div>
          <DashboardFilters />
        </div>

        <Suspense fallback={<SummaryCardsSkeleton count={4} />}>
          <DevicesSummarySection deviceSummaryPromise={deviceSummaryPromise} />
        </Suspense>

        <Suspense
          fallback={
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          }
        >
          <DevicesChartsSection
            deviceBreakdownPromise={deviceBreakdownPromise}
            deviceUsageTrendPromise={deviceUsageTrendPromise}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <TableSkeleton />
              <TableSkeleton />
            </div>
          }
        >
          <DevicesTablesSection browserStatsPromise={browserStatsPromise} osStatsPromise={osStatsPromise} />
        </Suspense>
      </div>
    </div>
  );
}

const parseDevicesSearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
