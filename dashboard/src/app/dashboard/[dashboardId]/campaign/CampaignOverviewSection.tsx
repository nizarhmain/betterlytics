'use client';

import { use } from 'react';
import CampaignPerformanceTable from '@/app/dashboard/[dashboardId]/campaign/CampaignPerformanceTable';
import CampaignVisitorTrendChart from '@/app/dashboard/[dashboardId]/campaign/CampaignVisitorTrendChart';
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
      <CampaignPerformanceTable data={campaignPerformance} />
      <CampaignVisitorTrendChart
        chartData={visitorTrend.data}
        categories={visitorTrend.categories}
        compareData={visitorTrend.compareData}
      />
    </div>
  );
}
