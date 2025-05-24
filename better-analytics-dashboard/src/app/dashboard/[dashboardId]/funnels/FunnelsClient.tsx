'use client';

import { useQuery } from '@tanstack/react-query';
import { FunnelDetails } from "@/entities/funnels";
import { actions } from "@/app/actions/dashboard";
import { Badge } from '@/components/ui/badge';
import { ReactNode, useMemo } from 'react';
import { analyzeFunnel } from './analytics';
import Link from 'next/link';
import { ArrowRightCircleIcon } from 'lucide-react';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function FunnelsClient() {
  const dashboardId = useDashboardId();
  const { data: funnels = [] } = useQuery<FunnelDetails[]>({
    queryKey: ['funnels', dashboardId],
    queryFn: () => actions.fetchFunnelsAction(dashboardId),
  });

  const funnelsData = useMemo(() => funnels.map((funnel) => analyzeFunnel(funnel)), [funnels]);

  return (
    <div className="p-4 md:p-6">
      {
        funnelsData.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No funnels found.</p>
            <p>Click "Create Funnel" to get started.</p>
          </div>
        )
      }
      {
        funnelsData
          .map((funnel) => (
            <div key={funnel.id} className='grid grid-cols-4 grid-rows-5 md:grid-rows-2 gap-2 bg-white p-3 rounded-md shadow mb-5'>
              <div className="flex col-span-3 gap-2">
                <h1 className="text-xl font-semibold">{funnel.name}</h1>
                <Badge className="rounded-full mt-0.5 text-gray-800 h-[1.5rem]" variant='outline'>{funnel.steps.length} steps</Badge>  
              </div>
              <div className='col-span-1 flex justify-end'>
                <Link className='text-right mr-2' href={`/dashboard/funnels/${funnel.id}`}><ArrowRightCircleIcon /></Link>
              </div>
              <div className='col-span-4 row-span-4 md:row-span-1 grid md:grid-cols-4 gap-2'>
                <InlineDataDisplay
                  title={'Conversion rate'}
                  value={`${Math.floor(100 * funnel.conversionRate)}%`}
                />
                <InlineDataDisplay
                  title={'Completed'}
                  value={funnel.visitorCount.min}
                />
                <InlineDataDisplay
                  title={'Total users'}
                  value={funnel.visitorCount.max}
                />
                <InlineDataDisplay
                  title={'Largest drop-off'}
                  value={`${Math.floor(100 * funnel.biggestDropOff.dropoffRatio)}%`}
                />
              </div>
            </div>
          ))
      }
    </div>
  );
}

type InlineDataDisplayProps = {
  title: ReactNode;
  value: ReactNode;
}
function InlineDataDisplay({ title, value }: InlineDataDisplayProps) {
  return (
    <div className='grid grid-cols-3 align-middle items-center md:place-items-center border-1 px-2 rounded-md shadow'>
      <h4 className='text-gray-700 text-sm ml-4 col-span-2 md:ml-0'>{title}:</h4>
      <p className='font-semibold'>{value}</p>
    </div>
  )
}