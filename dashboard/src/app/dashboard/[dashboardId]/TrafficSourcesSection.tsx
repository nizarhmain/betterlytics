"use client";

import MultiProgressTable from '@/components/MultiProgressTable';
import { fetchTrafficSourcesCombinedAction } from "@/app/actions/referrers";
import { use } from 'react';

type TrafficSourcesSectionProps = {
  trafficSourcesCombinedPromise: ReturnType<typeof fetchTrafficSourcesCombinedAction>;
};

export default function TrafficSourcesSection({ trafficSourcesCombinedPromise }: TrafficSourcesSectionProps) {
  const trafficSourcesCombined = use(trafficSourcesCombinedPromise);

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