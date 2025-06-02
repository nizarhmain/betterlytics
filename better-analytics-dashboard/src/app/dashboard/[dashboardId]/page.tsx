import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"
import DashboardFilters from "../../../components/dashboard/DashboardFilters"
import { TableSkeleton, SummaryCardSkeleton, ChartSkeleton } from "@/components/skeleton"
import SummaryAndChartSection from "./SummaryAndChartSection"
import PagesAnalyticsSection from "./PagesAnalyticsSection"
import GeographySection from "./GeographySection"
import DevicesSection from "./DevicesSection"
import TrafficSourcesSection from "./TrafficSourcesSection"
import CustomEventsSection from "./CustomEventsSection"
import { fetchDeviceBreakdownCombinedAction, fetchPageAnalyticsCombinedAction, fetchSessionMetricsAction, fetchSummaryStatsAction, fetchTotalPageViewsAction, fetchUniqueVisitorsAction, getWorldMapData } from '@/app/actions';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { GranularityRangeValues } from "@/utils/granularityRanges"

const SummaryAndChartSkeleton = () => (
  <div className='space-y-6'>
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {[1, 2, 3, 4].map((i) => (
        <SummaryCardSkeleton key={i} />
      ))}
    </div>
    <ChartSkeleton />
  </div>
);

type DashboardPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate: Date; endDate: Date; granularity: string }>;
};

export default async function DashboardPage({ params, searchParams }: DashboardPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }
  const { dashboardId } = await params;
  const { startDate, endDate, granularity } = await parseBASearchParams(searchParams);

  const analyticsCombinedPromise = fetchPageAnalyticsCombinedAction(dashboardId, startDate, endDate, 5, []);
  const worldMapPromise = getWorldMapData(dashboardId, { startDate, endDate, queryFilters: [] });

  const summaryAndChartPromise = Promise.all(
    [
      fetchSummaryStatsAction(dashboardId, startDate, endDate, []),
      fetchUniqueVisitorsAction(dashboardId, startDate, endDate, granularity, []),
      fetchTotalPageViewsAction(dashboardId, startDate, endDate, granularity, []),
      fetchSessionMetricsAction(dashboardId, startDate, endDate, granularity, []),
    ]
  );

  const devicePromise = fetchDeviceBreakdownCombinedAction(dashboardId, startDate, endDate, []);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <DashboardFilters />

        <Suspense fallback={<SummaryAndChartSkeleton />}>
          <SummaryAndChartSection data={summaryAndChartPromise} />
        </Suspense>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Suspense fallback={<TableSkeleton />}>
            <PagesAnalyticsSection analyticsCombinedPromise={analyticsCombinedPromise} />
          </Suspense>
          <Suspense fallback={<TableSkeleton />}>
            <GeographySection worldMapPromise={worldMapPromise} />
          </Suspense>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='flex-1 lg:flex-[2]'>
            <Suspense fallback={<TableSkeleton />}>
              <DevicesSection deviceBreakdownCombinedPromise={devicePromise} />
            </Suspense>
          </div>
          <div className='flex-1'>
            {/* <Suspense fallback={<TableSkeleton />}>
              <TrafficSourcesSection />
            </Suspense> */}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* <Suspense fallback={<TableSkeleton />}>
            <CustomEventsSection />
          </Suspense> */}
          <div>{/* Placeholder for future content */}</div>
        </div>
      </div>
    </div>
  );
}

const parseBASearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
