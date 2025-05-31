"use client";
import MultiProgressTable from '@/components/MultiProgressTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPageAnalyticsCombinedAction } from "@/app/actions";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function PagesAnalyticsSection() {
  const dashboardId = useDashboardId();
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();

  const { data: pageAnalyticsCombined } = useSuspenseQuery({
    queryKey: ['pageAnalyticsCombined', dashboardId, startDate, endDate, queryFilters],
    queryFn: () => fetchPageAnalyticsCombinedAction(dashboardId, startDate, endDate, 5, queryFilters),
  });

  return (
    <MultiProgressTable 
      title="Top Pages"
      defaultTab="pages"
      tabs={[
        {
          key: "pages",
          label: "Pages",
          data: pageAnalyticsCombined.topPages.map(page => ({ label: page.url, value: page.visitors })),
          emptyMessage: "No page data available"
        },
        {
          key: "entry",
          label: "Entry Pages", 
          data: pageAnalyticsCombined.topEntryPages.map(page => ({ label: page.url, value: page.visitors })),
          emptyMessage: "No entry pages data available"
        },
        {
          key: "exit",
          label: "Exit Pages",
          data: pageAnalyticsCombined.topExitPages.map(page => ({ label: page.url, value: page.visitors })),
          emptyMessage: "No exit pages data available"
        }
      ]}
    />
  );
} 