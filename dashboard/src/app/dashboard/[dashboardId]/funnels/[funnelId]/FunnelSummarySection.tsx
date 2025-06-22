import { use } from 'react';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { ArrowRight } from 'lucide-react';
import { fetchFunnelDetailsAction } from '@/app/actions';
import { formatPercentage } from '@/utils/formatters';

type FunnelSummarySectionProps = {
  funnelPromise: ReturnType<typeof fetchFunnelDetailsAction>;
};

export default function FunnelSummarySection({ funnelPromise }: FunnelSummarySectionProps) {
  const funnel = use(funnelPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Overall conversion',
      value: `${formatPercentage(Math.floor(100 * funnel.conversionRate))}`,
    },
    {
      title: 'Total visitors',
      value: `${funnel.visitorCount.max}`,
    },
    {
      title: 'Total completed',
      value: `${funnel.visitorCount.min}`,
    },
    {
      title: 'Biggest drop-off',
      value: (
        <span className='flex overflow-hidden overflow-x-auto text-sm text-ellipsis'>
          {funnel.biggestDropOff.step[0]} <ArrowRight className='mx-1 max-w-[1rem] min-w-[1rem]' />{' '}
          {funnel.biggestDropOff.step[1]}
        </span>
      ),
    },
  ];

  return <SummaryCardsSection cards={cards} className='!grid-cols-1' />;
}
