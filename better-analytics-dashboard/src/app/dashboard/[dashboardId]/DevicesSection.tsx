"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchDeviceBreakdownCombinedAction } from "@/app/actions/devices";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function DevicesSection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: deviceBreakdownCombined } = useSuspenseQuery({
    queryKey: ['deviceBreakdownCombined', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchDeviceBreakdownCombinedAction(dashboardId, startDate, endDate, queryFilters),
  });

  return (
    <MultiProgressTable 
      title="Devices Breakdown"
      defaultTab="browsers"
      tabs={[
        {
          key: "browsers",
          label: "Browsers",
          data: deviceBreakdownCombined.browsers.map(item => ({ label: item.browser, value: item.visitors })),
          emptyMessage: "No browser data available"
        },
        {
          key: "devices",
          label: "Devices", 
          data: deviceBreakdownCombined.devices.map(item => ({ label: item.device_type, value: item.visitors })),
          emptyMessage: "No device data available"
        },
        {
          key: "os",
          label: "Operating Systems",
          data: deviceBreakdownCombined.operatingSystems.map(item => ({ label: item.os, value: item.visitors })),
          emptyMessage: "No operating system data available"
        }
      ]}
    />
  );
} 