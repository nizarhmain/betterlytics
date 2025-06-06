'use client';

import UTMBreakdownTabbedTable from './UTMBreakdownTabbedTable';
import {
  fetchCampaignSourceBreakdownAction,
  fetchCampaignMediumBreakdownAction,
  fetchCampaignContentBreakdownAction,
  fetchCampaignTermBreakdownAction,
} from '@/app/actions';

type CampaignUTMSectionProps = {
  sourceBreakdownPromise: ReturnType<typeof fetchCampaignSourceBreakdownAction>;
  mediumBreakdownPromise: ReturnType<typeof fetchCampaignMediumBreakdownAction>;
  contentBreakdownPromise: ReturnType<typeof fetchCampaignContentBreakdownAction>;
  termBreakdownPromise: ReturnType<typeof fetchCampaignTermBreakdownAction>;
};

export default function CampaignUTMSection({
  sourceBreakdownPromise,
  mediumBreakdownPromise,
  contentBreakdownPromise,
  termBreakdownPromise,
}: CampaignUTMSectionProps) {
  return (
    <UTMBreakdownTabbedTable
      sourceBreakdownPromise={sourceBreakdownPromise}
      mediumBreakdownPromise={mediumBreakdownPromise}
      contentBreakdownPromise={contentBreakdownPromise}
      termBreakdownPromise={termBreakdownPromise}
    />
  );
}
