'use client';

import { use } from 'react';
import { fetchPagesSummaryWithChartsAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatDuration } from '@/utils/dateFormatters';

type PagesSummarySectionProps = {
  pagesSummaryWithChartsPromise: ReturnType<typeof fetchPagesSummaryWithChartsAction>;
};

export default function PagesSummarySection({ pagesSummaryWithChartsPromise }: PagesSummarySectionProps) {
  const summaryWithCharts = use(pagesSummaryWithChartsPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Pages per Session',
      value: summaryWithCharts.pagesPerSession.toLocaleString(),
      rawChartData: summaryWithCharts.pagesPerSessionChartData,
      valueField: 'value',
      chartColor: 'var(--chart-1)',
    },
    {
      title: 'Total Pageviews',
      value: summaryWithCharts.totalPageviews.toLocaleString(),
      rawChartData: summaryWithCharts.pageviewsChartData,
      valueField: 'views',
      chartColor: 'var(--chart-2)',
    },
    {
      title: 'Avg. Time on Page',
      value: formatDuration(summaryWithCharts.avgTimeOnPage),
      rawChartData: summaryWithCharts.avgTimeChartData,
      valueField: 'value',
      chartColor: 'var(--chart-3)',
    },
    {
      title: 'Avg. Bounce Rate',
      value: `${summaryWithCharts.avgBounceRate}%`,
      rawChartData: summaryWithCharts.bounceRateChartData,
      valueField: 'value',
      chartColor: 'var(--chart-4)',
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
