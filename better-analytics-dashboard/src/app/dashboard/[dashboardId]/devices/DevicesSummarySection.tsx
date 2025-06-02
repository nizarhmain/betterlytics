import { use } from 'react';
import { fetchDeviceSummaryAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';

type DevicesSummarySectionProps = {
  deviceSummaryPromise: ReturnType<typeof fetchDeviceSummaryAction>;
};

export default function DevicesSummarySection({ deviceSummaryPromise }: DevicesSummarySectionProps) {
  const deviceSummary = use(deviceSummaryPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Distinct Device Types',
      value: deviceSummary?.distinctDeviceCount.toString() ?? '0',
    },
    {
      title: 'Most Popular Device',
      value: deviceSummary?.topDevice
        ? `${deviceSummary.topDevice.name} (${deviceSummary.topDevice.percentage}%)`
        : 'Unknown',
    },
    {
      title: 'Most Popular Operating System',
      value: deviceSummary?.topOs ? `${deviceSummary.topOs.name} (${deviceSummary.topOs.percentage}%)` : 'Unknown',
    },
    {
      title: 'Most Popular Browser',
      value: deviceSummary?.topBrowser
        ? `${deviceSummary.topBrowser.name} (${deviceSummary.topBrowser.percentage}%)`
        : 'Unknown',
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
