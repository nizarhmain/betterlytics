import { use } from 'react';
import { fetchDeviceSummaryAction } from '@/app/actions';
import SummaryCardsSection, { SummaryCardData } from '@/components/dashboard/SummaryCardsSection';
import { formatPercentage } from '@/utils/formatters';
import { DeviceIcon, BrowserIcon, OSIcon } from '@/components/icons';
import { Monitor } from 'lucide-react';

type DevicesSummarySectionProps = {
  deviceSummaryPromise: ReturnType<typeof fetchDeviceSummaryAction>;
};

export default function DevicesSummarySection({ deviceSummaryPromise }: DevicesSummarySectionProps) {
  const deviceSummary = use(deviceSummaryPromise);

  const cards: SummaryCardData[] = [
    {
      title: 'Distinct Device Types',
      value: deviceSummary.distinctDeviceCount.toString(),
      icon: <Monitor className='h-4 w-4' />,
    },
    {
      title: 'Most Popular Device',
      value: `${deviceSummary.topDevice.name} (${formatPercentage(deviceSummary.topDevice.percentage)})`,
      icon: <DeviceIcon type={deviceSummary.topDevice.name} className='h-4 w-4' />,
    },
    {
      title: 'Most Popular Operating System',
      value: `${deviceSummary.topOs.name} (${formatPercentage(deviceSummary.topOs.percentage)})`,
      icon: <OSIcon name={deviceSummary.topOs.name} className='h-4 w-4' />,
    },
    {
      title: 'Most Popular Browser',
      value: `${deviceSummary.topBrowser.name} (${formatPercentage(deviceSummary.topBrowser.percentage)})`,
      icon: <BrowserIcon name={deviceSummary.topBrowser.name} className='h-4 w-4' />,
    },
  ];

  return <SummaryCardsSection cards={cards} />;
}
