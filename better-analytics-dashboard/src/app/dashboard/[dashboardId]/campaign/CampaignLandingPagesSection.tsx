'use client';

import { use } from 'react';
import CampaignLandingPagePerformanceTable from '@/components/analytics/CampaignLandingPagePerformanceTable';
import { fetchCampaignLandingPagePerformanceAction } from '@/app/actions';

type CampaignLandingPagesSectionProps = {
  landingPagePerformancePromise: ReturnType<typeof fetchCampaignLandingPagePerformanceAction>;
};

export default function CampaignLandingPagesSection({
  landingPagePerformancePromise,
}: CampaignLandingPagesSectionProps) {
  const landingPagePerformance = use(landingPagePerformancePromise);

  return (
    <div>
      <CampaignLandingPagePerformanceTable data={landingPagePerformance} isLoading={false} />
    </div>
  );
}
