"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import LeafletMap from '@/components/LeafletMap';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getWorldMapData } from "@/app/actions/geography";
import { getCountryName } from "@/utils/countryCodes";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { use } from 'react';

type GeographySectionProps = {
  worldMapPromise: ReturnType<typeof getWorldMapData>;
};

export default function GeographySection({ worldMapPromise }: GeographySectionProps) {
  const worldMapData = use(worldMapPromise);

  const topCountries = worldMapData.visitorData.slice(0, 10) || [];

  return (
    <MultiProgressTable
      title='Geography'
      defaultTab='countries'
      tabs={[
        {
          key: 'countries',
          label: 'Top Countries',
          data: topCountries.map((country) => ({
            label: getCountryName(country.country_code),
            value: country.visitors,
          })),
          emptyMessage: 'No country data available',
        },
        {
          key: 'worldmap',
          label: 'World Map',
          data: [],
          emptyMessage: 'No world map data available',
          customContent: worldMapData ? (
            <div className='h-[280px] w-full'>
              <LeafletMap visitorData={worldMapData.visitorData} showZoomControls={false} />
            </div>
          ) : (
            <div className='text-muted-foreground py-12 text-center'>No world map data available</div>
          ),
        },
      ]}
    />
  );
} 