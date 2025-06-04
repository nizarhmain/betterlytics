"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import { fetchPageAnalyticsCombinedAction } from '@/app/actions';
import { use } from 'react';

type PageAnalyticsSectionProps = {
  analyticsCombinedPromise: ReturnType<typeof fetchPageAnalyticsCombinedAction>;
};

export default function PagesAnalyticsSection({ analyticsCombinedPromise }: PageAnalyticsSectionProps) {
  const pageAnalyticsCombined = use(analyticsCombinedPromise);

  return (
    <MultiProgressTable
      title='Top Pages'
      defaultTab='pages'
      tabs={[
        {
          key: 'pages',
          label: 'Pages',
          data: pageAnalyticsCombined.topPages.map((page) => ({ label: page.url, value: page.visitors })),
          emptyMessage: 'No page data available',
        },
        {
          key: 'entry',
          label: 'Entry Pages',
          data: pageAnalyticsCombined.topEntryPages.map((page) => ({ label: page.url, value: page.visitors })),
          emptyMessage: 'No entry pages data available',
        },
        {
          key: 'exit',
          label: 'Exit Pages',
          data: pageAnalyticsCombined.topExitPages.map((page) => ({ label: page.url, value: page.visitors })),
          emptyMessage: 'No exit pages data available',
        },
      ]}
    />
  );
} 