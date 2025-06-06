'use client';
import MultiProgressTable from '@/components/MultiProgressTable';
import { fetchDeviceBreakdownCombinedAction } from '@/app/actions/devices';
import { use } from 'react';
import { BrowserIcon } from '@/components/icons/BrowserIcon';
import { DeviceIcon } from '@/components/icons/DeviceIcon';
import { OSIcon } from '@/components/icons/OSIcon';

type DevicesSectionProps = {
  deviceBreakdownCombinedPromise: ReturnType<typeof fetchDeviceBreakdownCombinedAction>;
};

export default function DevicesSection({ deviceBreakdownCombinedPromise }: DevicesSectionProps) {
  const deviceBreakdownCombined = use(deviceBreakdownCombinedPromise);

  return (
    <MultiProgressTable
      title='Devices Breakdown'
      defaultTab='browsers'
      tabs={[
        {
          key: 'browsers',
          label: 'Browsers',
          data: deviceBreakdownCombined.browsers.map((item) => ({
            label: item.browser,
            value: item.visitors,
            icon: <BrowserIcon name={item.browser} className='h-4 w-4' />,
          })),
          emptyMessage: 'No browser data available',
        },
        {
          key: 'devices',
          label: 'Devices',
          data: deviceBreakdownCombined.devices.map((item) => ({
            label: item.device_type,
            value: item.visitors,
            icon: <DeviceIcon type={item.device_type} className='h-4 w-4' />,
          })),
          emptyMessage: 'No device data available',
        },
        {
          key: 'os',
          label: 'Operating Systems',
          data: deviceBreakdownCombined.operatingSystems.map((item) => ({
            label: item.os,
            value: item.visitors,
            icon: <OSIcon name={item.os} className='h-4 w-4' />,
          })),
          emptyMessage: 'No operating system data available',
        },
      ]}
    />
  );
}
