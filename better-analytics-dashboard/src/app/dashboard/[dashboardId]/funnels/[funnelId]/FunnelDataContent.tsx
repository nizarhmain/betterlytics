'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FunnelDetails } from '@/entities/funnels';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import SummaryCard from '@/components/SummaryCard';
import { ArrowRight } from 'lucide-react';
import { analyzeFunnel } from '../analytics';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { fetchFunnelDetailsAction } from '@/app/actions';

type FunnelDataContentProps = {
  funnelId: string;
};

export function FunnelDataContent({ funnelId }: FunnelDataContentProps) {
  const dashboardId = useDashboardId();
  const { data: funnel, isLoading: funnelLoading } = useQuery<FunnelDetails>({
    queryKey: ['funnel', dashboardId, funnelId],
    queryFn: () => fetchFunnelDetailsAction(dashboardId, funnelId),
  });

  const funnelData = useMemo(() => {
    return funnel && analyzeFunnel(funnel);
  }, [funnel]);

  if (funnelLoading || !funnel || !funnelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='grid gap-6 rounded-md border-1 bg-white p-5 lg:grid-cols-3'>
      <div className='col-span-3 w-full text-sm font-semibold lg:col-span-2'>
        <div className='mb-3 flex items-center gap-3'>
          <h1 className='text-xl font-semibold'>{funnel.name}</h1>
          <Badge className='mt-1 h-[50%] rounded-full text-gray-800' variant='outline'>
            {funnelData.steps.length} steps
          </Badge>
        </div>
        {funnelData.steps.map((step, index) => (
          <div key={step.page}>
            <div className='flex items-end justify-between'>
              <div className='flex items-center gap-3'>
                <p className='flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium'>
                  {index + 1}
                </p>
                <p>{step.page}</p>
              </div>
              <p className='mt-3'>{step.visitors} users</p>
            </div>
            <div className='p-3 text-gray-600'>
              <Progress className='h-4' value={100 * step.visitorsRatio} color='#22C55E' />
              <div className='flex items-end justify-between'>
                <p>{step.visitors} users</p>
                <p className='text-right'>{Math.floor(100 * step.visitorsRatio)}%</p>
              </div>
              <Progress className='mt-2' value={100 * step.dropoffRatio} color='#F97315' />
              <div className='flex items-end justify-between'>
                <p>{step.dropoffCount} users dropped-off</p>
                <p className='text-right'>{Math.floor(100 * step.dropoffRatio)}%</p>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <div className='col-span-3 pl-3 text-sm lg:col-span-1 lg:border-l-1'>
        <div className='flex flex-col gap-3 rounded-lg bg-gray-200 p-4'>
          <SummaryCard
            title='Overall conversion'
            value={`${Math.floor(100 * funnelData.conversionRate)}%`}
            changeText={''}
          />
          <SummaryCard title='Total visitors' value={`${funnelData.visitorCount.max}`} changeText={''} />
          <SummaryCard title='Total completed' value={`${funnelData.visitorCount.min}`} changeText={''} />
          <SummaryCard
            title='Biggest drop-off'
            value={
              <span className='flex overflow-hidden overflow-x-auto text-sm text-ellipsis'>
                {funnelData.biggestDropOff.pageStep[0]} <ArrowRight className='mx-1 max-w-[1rem] min-w-[1rem]' />{' '}
                {funnelData.biggestDropOff.pageStep[1]}
              </span>
            }
            changeText={`${funnelData.biggestDropOff.dropoffCount} users (${Math.floor(100 * funnelData.biggestDropOff.dropoffRatio)}%)`}
            changeColor='text-orange-600'
          />
        </div>
      </div>
    </div>
  );
}
