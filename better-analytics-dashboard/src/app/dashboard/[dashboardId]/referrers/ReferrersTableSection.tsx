'use client';

import { use } from 'react';
import ReferrerTable from '@/app/dashboard/[dashboardId]/referrers/ReferrerTable';
import { fetchReferrerTableDataForSite } from '@/app/actions';

type ReferrersTableSectionProps = {
  referrerTablePromise: ReturnType<typeof fetchReferrerTableDataForSite>;
};

export default function ReferrersTableSection({ referrerTablePromise }: ReferrersTableSectionProps) {
  const tableResult = use(referrerTablePromise);
  const tableData = tableResult.data;

  return (
    <div className='bg-card border-border rounded-lg border p-4 shadow'>
      <div className='text-foreground mb-2 font-medium'>Referrer Details</div>
      <p className='text-muted-foreground mb-4 text-xs'>Detailed breakdown of traffic sources</p>
      <ReferrerTable data={tableData} loading={false} />
    </div>
  );
}
