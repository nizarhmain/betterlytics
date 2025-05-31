"use client";

import MultiProgressTable from '@/components/MultiProgressTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchTrafficSourcesCombinedAction } from "@/app/actions/referrers";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function TrafficSourcesSection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: trafficSourcesCombined } = useSuspenseQuery({
    queryKey: ['trafficSourcesCombined', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchTrafficSourcesCombinedAction(dashboardId, startDate, endDate, 10),
  });

  return (
    <MultiProgressTable 
      title="Traffic Sources"
      defaultTab="referrers"
      tabs={[
        {
          key: "referrers",
          label: "Referrers",
          data: trafficSourcesCombined.topReferrerUrls
            .filter(item => item.referrer_url && item.referrer_url.trim() !== '')
            .map(item => ({ label: item.referrer_url, value: item.visits })),
          emptyMessage: "No referrer data available"
        },
        {
          key: "sources",
          label: "Sources", 
          data: trafficSourcesCombined.topReferrerSources.map(item => ({ label: item.referrer_source, value: item.visits })),
          emptyMessage: "No source data available"
        },
        {
          key: "channels",
          label: "Channels",
          data: trafficSourcesCombined.topChannels.map(item => ({ label: item.channel, value: item.visits })),
          emptyMessage: "No channel data available"
        }
      ]}
    />
  );
} 