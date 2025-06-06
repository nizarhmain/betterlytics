import { use } from 'react';
import { fetchReferrerSummaryDataForSite } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatDuration } from '@/utils/dateFormatters';
import { formatPercentage } from '@/utils/formatters';

type ReferrersSummarySectionProps = {
  referrerSummaryPromise: ReturnType<typeof fetchReferrerSummaryDataForSite>;
};

export default function ReferrersSummarySection({ referrerSummaryPromise }: ReferrersSummarySectionProps) {
  const summaryResult = use(referrerSummaryPromise);
  const summaryData = summaryResult.data;

  const referralPercentage =
    summaryData.totalSessions > 0 ? (summaryData.referralSessions / summaryData.totalSessions) * 100 : 0;

  const cards: SummaryCardData[] = [
    {
      title: 'Referral Sessions',
      value: summaryData.referralSessions.toLocaleString(),
    },
    {
      title: 'Referral Traffic %',
      value: formatPercentage(referralPercentage),
    },
    {
      title: 'Top Referrer Source',
      value: summaryData.topReferrerSource,
    },
    {
      title: 'Avg. Session Duration',
      value: formatDuration(summaryData.avgSessionDuration),
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
