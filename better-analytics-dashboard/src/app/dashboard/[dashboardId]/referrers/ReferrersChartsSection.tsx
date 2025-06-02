'use client';

import { use } from 'react';
import ReferrerDistributionChart from '@/components/charts/ReferrerDistributionChart';
import ReferrerTrafficTrendChart from '@/components/charts/ReferrerTrafficTrendChart';
import {
  fetchReferrerSourceAggregationDataForSite,
  fetchReferrerTrafficTrendBySourceDataForSite,
} from '@/app/actions';

type ReferrersChartsSectionProps = {
  distributionPromise: ReturnType<typeof fetchReferrerSourceAggregationDataForSite>;
  trendPromise: ReturnType<typeof fetchReferrerTrafficTrendBySourceDataForSite>;
};

export default function ReferrersChartsSection({
  distributionPromise,
  trendPromise,
}: ReferrersChartsSectionProps) {
  const distributionResult = use(distributionPromise);
  const trendResult = use(trendPromise);

  const distributionData = distributionResult.data;
  const trendData = trendResult.data;

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='bg-card border-border rounded-lg border p-4 shadow'>
        <div className='text-foreground mb-2 font-medium'>Referrer Distribution</div>
        <p className='text-muted-foreground mb-4 text-xs'>Traffic sources by category</p>
        <ReferrerDistributionChart data={distributionData} loading={false} />
      </div>
      <div className='bg-card border-border rounded-lg border p-4 shadow'>
        <div className='text-foreground mb-2 font-medium'>Referral Traffic Trends</div>
        <p className='text-muted-foreground mb-4 text-xs'>Traffic by source over time</p>
        <ReferrerTrafficTrendChart data={trendData} loading={false} />
      </div>
    </div>
  );
}
