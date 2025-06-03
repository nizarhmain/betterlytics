import { use } from 'react';
import { fetchSummaryStatsAction, fetchPageAnalyticsAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatPercentage } from '@/utils/formatters';
import { formatDuration } from '@/utils/dateFormatters';

type PagesSummarySectionProps = {
  summaryStatsPromise: ReturnType<typeof fetchSummaryStatsAction>;
  pageAnalyticsPromise: ReturnType<typeof fetchPageAnalyticsAction>;
};

export default function PagesSummarySection({
  summaryStatsPromise,
  pageAnalyticsPromise,
}: PagesSummarySectionProps) {
  const summary = use(summaryStatsPromise);
  const pages = use(pageAnalyticsPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Total Pages',
      value: String(pages.length),
    },
    {
      title: 'Avg. Page Views',
      value:
        pages.length > 0
          ? Math.round(pages.reduce((sum, p) => sum + p.pageviews, 0) / pages.length).toLocaleString()
          : '0',
    },
    {
      title: 'Avg. Time on Page',
      value: `${formatDuration(summary.avgVisitDuration)}`,
    },
    {
      title: 'Bounce Rate',
      value: formatPercentage(summary.bounceRate),
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
