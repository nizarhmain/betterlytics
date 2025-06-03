import { use } from 'react';
import { fetchDeviceSummaryAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatPercentage } from '@/utils/formatters';

type DevicesSummarySectionProps = {
  deviceSummaryPromise: ReturnType<typeof fetchDeviceSummaryAction>;
};

export default function DevicesSummarySection({ deviceSummaryPromise }: DevicesSummarySectionProps) {
  const deviceSummary = use(deviceSummaryPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Distinct Device Types',
      value: deviceSummary.distinctDeviceCount.toString(),
    },
    {
      title: 'Most Popular Device',
      value: `${deviceSummary.topDevice.name} (${formatPercentage(deviceSummary.topDevice.percentage)})`,
    },
    {
      title: 'Most Popular Operating System',
      value: `${deviceSummary.topOs.name} (${formatPercentage(deviceSummary.topOs.percentage)})`,
    },
    {
      title: 'Most Popular Browser',
      value: `${deviceSummary.topBrowser.name} (${formatPercentage(deviceSummary.topBrowser.percentage)})`,
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
