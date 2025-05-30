'use client';

import { useState, useEffect } from 'react';
import SummaryCard from '@/components/SummaryCard';
import ReferrerDistributionChart from '@/components/charts/ReferrerDistributionChart';
import ReferrerTrafficTrendChart from '@/components/charts/ReferrerTrafficTrendChart';
import ReferrerTable from '@/components/charts/ReferrerTable';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import {
  fetchReferrerSourceAggregationDataForSite,
  fetchReferrerSummaryDataForSite,
  fetchReferrerTableDataForSite,
  fetchReferrerTrafficTrendBySourceDataForSite,
} from '@/app/actions';
import {
  ReferrerSourceAggregation,
  ReferrerSummary,
  ReferrerTableRow,
  ReferrerTrafficBySourceRow,
} from '@/entities/referrers';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import { formatPercentage } from '@/utils/formatters';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function ReferrersClient() {
  const dashboardId = useDashboardId();
  const [distributionData, setDistributionData] = useState<ReferrerSourceAggregation[] | undefined>(undefined);
  const [trendBySourceData, setTrendBySourceData] = useState<ReferrerTrafficBySourceRow[] | undefined>(undefined);
  const [summaryData, setSummaryData] = useState<ReferrerSummary | undefined>(undefined);
  const [tableData, setTableData] = useState<ReferrerTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { granularity, startDate, endDate } = useTimeRangeContext();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [distributionResult, trendBySourceResult, summaryResult, tableResult] = await Promise.all([
          fetchReferrerSourceAggregationDataForSite(dashboardId, startDate, endDate),
          fetchReferrerTrafficTrendBySourceDataForSite(dashboardId, startDate, endDate, granularity),
          fetchReferrerSummaryDataForSite(dashboardId, startDate, endDate),
          fetchReferrerTableDataForSite(dashboardId, startDate, endDate),
        ]);

        setDistributionData(distributionResult.data);
        setTrendBySourceData(trendBySourceResult.data);
        setSummaryData(summaryResult.data);
        setTableData(tableResult.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate, granularity, dashboardId]);

  return (
    <div className='space-y-6 p-6'>
      <div>
        <div className='mb-6 flex flex-col justify-between gap-y-1 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-foreground mb-1 text-2xl font-bold'>Referrers</h1>
            <p className='text-muted-foreground text-sm'>Analytics and insights for your website</p>
          </div>
          <TimeRangeSelector />
        </div>

        {/* Summary Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <SummaryCard
            title='Total Referrers'
            value={loading || !summaryData ? '-' : summaryData.totalReferrers.toString()}
            changeText=''
          />
          <SummaryCard
            title='Referral Traffic'
            value={loading || !summaryData ? '-' : summaryData.referralTraffic.toString()}
            changeText=''
          />
          <SummaryCard
            title='Avg. Bounce Rate'
            value={loading || !summaryData ? '-' : formatPercentage(summaryData.avgBounceRate)}
            changeText=''
          />
        </div>

        {/* Charts */}
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='bg-card border-border rounded-lg border p-4 shadow'>
            <div className='text-foreground mb-2 font-medium'>Referrer Distribution</div>
            <p className='text-muted-foreground mb-4 text-xs'>Traffic sources by category</p>
            <ReferrerDistributionChart data={distributionData} loading={loading} />
          </div>
          <div className='bg-card border-border rounded-lg border p-4 shadow'>
            <div className='text-foreground mb-2 font-medium'>Referral Traffic Trends</div>
            <p className='text-muted-foreground mb-4 text-xs'>Traffic by source over time</p>
            <ReferrerTrafficTrendChart data={trendBySourceData} loading={loading} />
          </div>
        </div>

        {/* Referrer Table */}
        <div className='bg-card border-border rounded-lg border p-4 shadow'>
          <div className='text-foreground mb-2 font-medium'>Referrer Details</div>
          <p className='text-muted-foreground mb-4 text-xs'>Detailed breakdown of traffic sources</p>
          <ReferrerTable data={tableData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
