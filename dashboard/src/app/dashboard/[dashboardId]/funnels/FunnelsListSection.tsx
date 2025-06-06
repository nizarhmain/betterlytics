'use client';

import { use, useMemo, ReactNode } from 'react';
import { fetchFunnelsAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { analyzeFunnel } from './analytics';
import { ArrowRightCircleIcon } from 'lucide-react';
import { FilterPreservingLink } from '@/components/ui/FilterPreservingLink';
import { FunnelsEmptyState } from './FunnelsEmptyState';

type FunnelsListSectionProps = {
  funnelsPromise: ReturnType<typeof fetchFunnelsAction>;
  dashboardId: string;
};

export default function FunnelsListSection({ funnelsPromise, dashboardId }: FunnelsListSectionProps) {
  const funnels = use(funnelsPromise);
  const funnelsData = useMemo(() => funnels.map((funnel) => analyzeFunnel(funnel)), [funnels]);

  if (funnelsData.length === 0) {
    return <FunnelsEmptyState />;
  }

  return (
    <div className='space-y-5'>
      {funnelsData.map((funnel) => (
        <div
          key={funnel.id}
          className='grid grid-cols-4 grid-rows-5 gap-2 rounded-md bg-white p-3 shadow md:grid-rows-2'
        >
          <div className='col-span-3 flex gap-2'>
            <h1 className='text-xl font-semibold'>{funnel.name}</h1>
            <Badge className='mt-0.5 h-[1.5rem] rounded-full text-gray-800' variant='outline'>
              {funnel.steps.length} steps
            </Badge>
          </div>
          <div className='col-span-1 flex justify-end'>
            <FilterPreservingLink
              className='mr-2 text-right'
              href={`/dashboard/${dashboardId}/funnels/${funnel.id}`}
            >
              <ArrowRightCircleIcon />
            </FilterPreservingLink>
          </div>
          <div className='col-span-4 row-span-4 grid gap-2 md:row-span-1 md:grid-cols-4'>
            <InlineDataDisplay title={'Conversion rate'} value={`${Math.floor(100 * funnel.conversionRate)}%`} />
            <InlineDataDisplay title={'Completed'} value={funnel.visitorCount.min} />
            <InlineDataDisplay title={'Total users'} value={funnel.visitorCount.max} />
            <InlineDataDisplay
              title={'Largest drop-off'}
              value={`${Math.floor(100 * funnel.biggestDropOff.dropoffRatio)}%`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type InlineDataDisplayProps = {
  title: ReactNode;
  value: ReactNode;
};

function InlineDataDisplay({ title, value }: InlineDataDisplayProps) {
  return (
    <div className='grid grid-cols-3 items-center rounded-md border-1 px-2 align-middle shadow md:place-items-center'>
      <h4 className='col-span-2 ml-4 text-sm text-gray-700 md:ml-0'>{title}:</h4>
      <p className='font-semibold'>{value}</p>
    </div>
  );
}
