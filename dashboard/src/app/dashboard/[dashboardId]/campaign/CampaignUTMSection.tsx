'use client';

import { use } from 'react';
import CampaignPieChart, { CampaignDataKey } from '@/components/analytics/CampaignPieChart';
import CampaignEngagementTable from '@/components/analytics/CampaignEngagementTable';
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
  const sourceBreakdown = use(sourceBreakdownPromise);
  const mediumBreakdown = use(mediumBreakdownPromise);
  const contentBreakdown = use(contentBreakdownPromise);
  const termBreakdown = use(termBreakdownPromise);

  return (
    <div className='space-y-6'>
      {/* Source Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CampaignEngagementTable
            data={sourceBreakdown}
            title='Source Engagement Metrics'
            subtitle='Engagement details for each campaign source'
            dataKey='source'
          />
        </div>
        <CampaignPieChart
          data={sourceBreakdown}
          dataKey={CampaignDataKey.SOURCE}
          title='Campaign Traffic by Source'
          subtitle='Distribution of campaign visitors by source'
          emptyStateMessage='No source breakdown data available for campaigns.'
        />
      </div>

      <hr className='border-border my-6' />

      {/* Medium Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CampaignEngagementTable
            data={mediumBreakdown}
            title='Medium Engagement Metrics'
            subtitle='Engagement details for each campaign medium'
            dataKey='medium'
          />
        </div>
        <CampaignPieChart
          data={mediumBreakdown}
          dataKey={CampaignDataKey.MEDIUM}
          title='Campaign Traffic by Medium'
          subtitle='Distribution of campaign visitors by medium'
          emptyStateMessage='No medium breakdown data available for campaigns.'
        />
      </div>

      <hr className='border-border my-6' />

      {/* Content Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CampaignEngagementTable
            data={contentBreakdown}
            title='Content Engagement Metrics'
            subtitle='Engagement details for each campaign content'
            dataKey='content'
          />
        </div>
        <CampaignPieChart
          data={contentBreakdown}
          dataKey={CampaignDataKey.CONTENT}
          title='Campaign Traffic by Content'
          subtitle='Distribution of campaign visitors by content'
          emptyStateMessage='No content breakdown data available for campaigns.'
        />
      </div>

      <hr className='border-border my-6' />

      {/* Term/Keyword Breakdown */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <CampaignEngagementTable
            data={termBreakdown}
            title='Term/Keyword Engagement Metrics'
            subtitle='Engagement details for each campaign term/keyword'
            dataKey='term'
          />
        </div>
        <CampaignPieChart
          data={termBreakdown}
          dataKey={CampaignDataKey.TERM}
          title='Campaign Traffic by Term/Keyword'
          subtitle='Distribution of campaign visitors by term/keyword'
          emptyStateMessage='No term breakdown data available for campaigns.'
        />
      </div>
    </div>
  );
}
