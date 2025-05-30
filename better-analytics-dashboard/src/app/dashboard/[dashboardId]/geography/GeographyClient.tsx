'use client';

import { useEffect, useState } from 'react';
import LeafletMap from '@/components/LeafletMap';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import { useTimeRangeContext } from '@/contexts/TimeRangeContextProvider';
import { getWorldMapData } from '@/app/actions';
import { GeoVisitor } from '@/entities/geography';
import { alpha2ToAlpha3Code } from '@/utils/countryCodes';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import QueryFiltersSelector from '@/components/filters/QueryFiltersSelector';
import { useDashboardId } from '@/hooks/use-dashboard-id';

export default function GeographyClient() {
  const dashboardId = useDashboardId();
  const [visitorData, setVisitorData] = useState<GeoVisitor[]>([]);
  const [maxVisitors, setMaxVisitors] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { queryFilters } = useQueryFiltersContext();

  const { startDate, endDate } = useTimeRangeContext();

  const siteId = 'default-site';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getWorldMapData(dashboardId, { startDate, endDate, queryFilters });

        // Convert alpha-2 country codes to alpha-3 for map compatibility with the current geojson data format
        const processedData = data.visitorData.map((visitor) => {
          if (visitor.country_code === 'Localhost') {
            return visitor;
          }

          const alpha3 = alpha2ToAlpha3Code(visitor.country_code);

          return alpha3
            ? {
                ...visitor,
                country_code: alpha3,
              }
            : visitor;
        });

        setVisitorData(processedData);
        setMaxVisitors(data.maxVisitors);
      } catch (err) {
        console.error('Error fetching visitor map data:', err);
        setError('Failed to load geographic visitor data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId, startDate, endDate, queryFilters]);

  return (
    <div className='relative flex h-full w-full flex-col'>
      <div className='absolute inset-0 h-full w-full'>
        <LeafletMap visitorData={visitorData} maxVisitors={maxVisitors} />
      </div>

      <div className='absolute top-4 right-4 z-[1001]'>
        <div className='bg-card flex flex-col gap-4 rounded-md p-2 shadow-md sm:flex-row'>
          <QueryFiltersSelector />
          <TimeRangeSelector />
        </div>
      </div>

      {loading && (
        <div className='bg-background/70 absolute inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm'>
          <div className='flex flex-col items-center'>
            <div className='border-accent border-t-primary mb-2 h-10 w-10 animate-spin rounded-full border-4'></div>
            <p className='text-foreground'>Loading visitor data...</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className='bg-destructive/10 border-destructive/20 absolute right-4 bottom-4 z-[1000] rounded-md border p-3 shadow-md'>
          <p className='text-destructive text-sm'>{error}</p>
        </div>
      )}

      {!loading && !error && visitorData.length === 0 && (
        <div className='absolute right-4 bottom-4 z-[1000] rounded-md border border-amber-200 bg-amber-50 p-3 shadow-md'>
          <p className='text-sm text-amber-700'>No geographic data available for the selected period</p>
        </div>
      )}
    </div>
  );
}
