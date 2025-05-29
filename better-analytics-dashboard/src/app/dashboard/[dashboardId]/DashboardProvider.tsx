'use client';

import React, { useEffect } from 'react';
import { TimeRangeContextProvider } from '@/contexts/TimeRangeContextProvider';
import { QueryFiltersContextProvider } from '@/contexts/QueryFiltersContextProvider';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteId } from '@/app/actions';

type DashboardProviderProps = {
  children: React.ReactNode;
};

export function DashboardProvider({ children }: DashboardProviderProps) {
  const dashboardId = useDashboardId();
  const { data: siteId } = useQuery({
    queryKey: ['siteId', dashboardId],
    queryFn: () => fetchSiteId(dashboardId),
  });

  useEffect(() => {
    if (!siteId) {
      return () => {};
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = 'http://localhost:3006/analytics.js';
    script.setAttribute('data-site-id', siteId);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [siteId]);

  return (
    <TimeRangeContextProvider>
      <QueryFiltersContextProvider>{children}</QueryFiltersContextProvider>
    </TimeRangeContextProvider>
  );
}
