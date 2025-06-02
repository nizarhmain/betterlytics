import { use } from 'react';
import { fetchReferrerSummaryDataForSite } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatPercentage } from '@/utils/formatters';

type ReferrersSummarySectionProps = {
  referrerSummaryPromise: ReturnType<typeof fetchReferrerSummaryDataForSite>;
};

export default function ReferrersSummarySection({ referrerSummaryPromise }: ReferrersSummarySectionProps) {
  const summaryResult = use(referrerSummaryPromise);
  const summaryData = summaryResult.data;

  const cards: SummaryCardData[] = [
    {
      title: 'Total Referrers',
      value: summaryData?.totalReferrers.toString() ?? '0',
    },
    {
      title: 'Referral Traffic',
      value: summaryData?.referralTraffic.toString() ?? '0',
    },
    {
      title: 'Avg. Bounce Rate',
      value: summaryData ? formatPercentage(summaryData.avgBounceRate) : '0%',
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
