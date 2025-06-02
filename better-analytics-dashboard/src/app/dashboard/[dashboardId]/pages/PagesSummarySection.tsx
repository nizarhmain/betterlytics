import { use } from 'react';
import { fetchSummaryStatsAction, fetchPageAnalyticsAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';

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
      value: summary?.avgVisitDuration
        ? `${Math.round(summary.avgVisitDuration / 60)}m ${summary.avgVisitDuration % 60}s`
        : '0s',
    },
    {
      title: 'Bounce Rate',
      value: summary?.bounceRate ? `${summary.bounceRate}%` : '0%',
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
