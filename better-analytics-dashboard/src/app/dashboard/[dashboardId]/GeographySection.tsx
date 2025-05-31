"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import LeafletMap from '@/components/LeafletMap';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getWorldMapData } from "@/app/actions/geography";
import { getCountryName } from "@/utils/countryCodes";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function GeographySection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: worldMapData } = useSuspenseQuery({
    queryKey: ['worldMapData', dashboardId, startDate, endDate, queryFilters],
    queryFn: async () => {
      const result = await getWorldMapData(dashboardId, { startDate, endDate, queryFilters });
      return result.visitorData;
    },
  });

  const topCountries = worldMapData.slice(0, 10) || [];

  return (
    <MultiProgressTable 
      title="Geography"
      defaultTab="countries"
      tabs={[
        {
          key: "countries",
          label: "Top Countries",
          data: (topCountries).map(country => ({ 
            label: getCountryName(country.country_code), 
            value: country.visitors 
          })),
          emptyMessage: "No country data available"
        },
        {
          key: "worldmap",
          label: "World Map",
          data: [],
          emptyMessage: "No world map data available",
          customContent: worldMapData ? (
            <div className="h-[280px] w-full">
              <LeafletMap 
                visitorData={worldMapData}
                showZoomControls={false}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No world map data available
            </div>
          )
        }
      ]}
    />
  );
} 