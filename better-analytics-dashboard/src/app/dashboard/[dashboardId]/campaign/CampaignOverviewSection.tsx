'use client';

import { use } from 'react';
import CampaignPerformanceTable from '@/components/analytics/CampaignPerformanceTable';
import CampaignVisitorTrendChart from '@/components/analytics/CampaignVisitorTrendChart';
import { fetchCampaignPerformanceAction, fetchCampaignVisitorTrendAction } from '@/app/actions';

type CampaignOverviewSectionProps = {
  campaignPerformancePromise: ReturnType<typeof fetchCampaignPerformanceAction>;
  visitorTrendPromise: ReturnType<typeof fetchCampaignVisitorTrendAction>;
};

export default function CampaignOverviewSection({
  campaignPerformancePromise,
  visitorTrendPromise,
}: CampaignOverviewSectionProps) {
  const campaignPerformance = use(campaignPerformancePromise);
  const visitorTrend = use(visitorTrendPromise);

  return (
    <div className='space-y-6'>
      <CampaignPerformanceTable data={campaignPerformance} isLoading={false} />
      <CampaignVisitorTrendChart data={visitorTrend} isLoading={false} />
    </div>
  );
}
