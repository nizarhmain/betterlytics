import { ReactNode } from 'react';
import SummaryCard from '@/components/SummaryCard';

export interface SummaryCardData {
  title: string;
  value: ReactNode;
  rawChartData?: any[];
  valueField?: string;
  chartColor?: string;
  isActive?: boolean;
  onClick?: () => void;
}

type SummaryCardsSectionProps = {
  cards: SummaryCardData[];
};

export default function SummaryCardsSection({ cards }: SummaryCardsSectionProps) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, index) => (
        <SummaryCard
          key={`${card.title}-${index}`}
          title={card.title}
          value={card.value}
          rawChartData={card.rawChartData}
          valueField={card.valueField}
          chartColor={card.chartColor}
          isActive={card.isActive}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
}
