'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import SummaryCard from '@/components/SummaryCard';
import { fetchPageDetailAction, fetchPageTrafficTimeSeriesAction } from '@/app/actions';
import { PageAnalytics } from '@/entities/pages';
import { formatDuration } from '@/utils/dateFormatters';
import PageTrafficChart from '@/components/PageTrafficChart';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import { TotalPageViewsRow } from '@/entities/pageviews';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { FilterPreservingLink } from '@/components/ui/FilterPreservingLink';

interface PageDetailClientProps {
  path: string;
}

export default function PageDetailClient({ path }: PageDetailClientProps) {
  const dashboardId = useDashboardId();
  const { startDate, endDate, granularity } = useTimeRangeContext();

  const { data: pageDetail, isLoading: isLoadingPageDetail } = useQuery<PageAnalytics | null>({
    queryKey: ['pageDetail', dashboardId, path, startDate, endDate],
    queryFn: () => fetchPageDetailAction(dashboardId, path, startDate, endDate),
  });

  const { data: pageTrafficData = [] as TotalPageViewsRow[], isLoading: isLoadingPageTraffic } = useQuery<
    TotalPageViewsRow[]
  >({
    queryKey: ['pageTraffic', dashboardId, path, startDate, endDate, granularity],
    queryFn: () => fetchPageTrafficTimeSeriesAction(dashboardId, path, startDate, endDate, granularity),
  });

  const displayTitle = path;

  return (
    <div className='space-y-6 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <FilterPreservingLink
            href={`/dashboard/${dashboardId}/pages`}
            className='text-gray-500 hover:text-gray-700'
          >
            <ArrowLeft size={18} />
          </FilterPreservingLink>
          <h1 className='text-2xl font-bold text-gray-900'>Page Details</h1>
        </div>

        <TimeRangeSelector />
      </div>

      <h2 className='mb-6 ml-1 text-xl font-semibold break-all'>{displayTitle}</h2>

      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <SummaryCard
          title='Visitors'
          value={isLoadingPageDetail ? '...' : pageDetail?.visitors.toLocaleString() || '0'}
        />
        <SummaryCard
          title='Page Views'
          value={isLoadingPageDetail ? '...' : pageDetail?.pageviews.toLocaleString() || '0'}
        />
        <SummaryCard title='Bounce Rate' value={isLoadingPageDetail ? '...' : `${pageDetail?.bounceRate || 0}%`} />
        <SummaryCard
          title='Avg. Time on Page'
          value={isLoadingPageDetail ? '...' : formatDuration(pageDetail?.avgTime || 0)}
        />
      </div>

      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-lg font-bold text-gray-900'>Traffic Over Time</h2>
        <PageTrafficChart
          pageTrafficData={pageTrafficData}
          isLoading={isLoadingPageTraffic}
          granularity={granularity}
        />
      </div>

      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-lg font-bold text-gray-900'>Referral Sources</h2>
        <div className='py-8 text-center text-gray-500'>Referral sources placeholder</div>
      </div>
    </div>
  );
}
