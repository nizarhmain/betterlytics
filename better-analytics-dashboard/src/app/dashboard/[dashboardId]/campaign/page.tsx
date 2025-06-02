import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import {
  fetchCampaignPerformanceAction,
  fetchCampaignSourceBreakdownAction,
  fetchCampaignVisitorTrendAction,
  fetchCampaignMediumBreakdownAction,
  fetchCampaignContentBreakdownAction,
  fetchCampaignTermBreakdownAction,
  fetchCampaignLandingPagePerformanceAction,
} from '@/app/actions';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import CampaignTabs from './CampaignTabs';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

type CampaignPageParams = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>;
};

export default async function CampaignPage({ params, searchParams }: CampaignPageParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;
  const { startDate, endDate } = await parseCampaignSearchParams(searchParams);

  const campaignPerformancePromise = fetchCampaignPerformanceAction(dashboardId, startDate, endDate);
  const sourceBreakdownPromise = fetchCampaignSourceBreakdownAction(dashboardId, startDate, endDate);
  const visitorTrendPromise = fetchCampaignVisitorTrendAction(dashboardId, startDate, endDate);
  const mediumBreakdownPromise = fetchCampaignMediumBreakdownAction(dashboardId, startDate, endDate);
  const contentBreakdownPromise = fetchCampaignContentBreakdownAction(dashboardId, startDate, endDate);
  const termBreakdownPromise = fetchCampaignTermBreakdownAction(dashboardId, startDate, endDate);
  const landingPagePerformancePromise = fetchCampaignLandingPagePerformanceAction(dashboardId, startDate, endDate);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Campaigns</h1>
            <p className='text-muted-foreground text-sm'>Campaign performance analytics and insights</p>
          </div>
          <DashboardFilters />
        </div>

        <CampaignTabs
          campaignPerformancePromise={campaignPerformancePromise}
          visitorTrendPromise={visitorTrendPromise}
          sourceBreakdownPromise={sourceBreakdownPromise}
          mediumBreakdownPromise={mediumBreakdownPromise}
          contentBreakdownPromise={contentBreakdownPromise}
          termBreakdownPromise={termBreakdownPromise}
          landingPagePerformancePromise={landingPagePerformancePromise}
        />
      </div>
    </div>
  );
}

const parseCampaignSearchParams = async (
  searchParams: Promise<{ startDate?: Date; endDate?: Date; granularity?: string }>,
) => {
  const { startDate: startDateStr, endDate: endDateStr, granularity: granularityStr } = await searchParams;

  const startDate = new Date(+(startDateStr ?? Date.now()) - 100_000_000);
  const endDate = new Date(+(endDateStr ?? Date.now()));
  const granularity = (granularityStr ?? 'day') as GranularityRangeValues;
  return { startDate, endDate, granularity };
};
