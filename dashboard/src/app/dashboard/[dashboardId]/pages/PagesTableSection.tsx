'use client';

import { use } from 'react';
import PagesTable from '@/components/analytics/PagesTable';
import { fetchPageAnalyticsAction } from '@/app/actions';

type PagesTableSectionProps = {
  pageAnalyticsPromise: ReturnType<typeof fetchPageAnalyticsAction>;
};

export default function PagesTableSection({ pageAnalyticsPromise }: PagesTableSectionProps) {
  const pages = use(pageAnalyticsPromise);

  return <PagesTable data={pages} />;
}
