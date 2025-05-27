"use client";

import React, { useEffect } from "react"
import { TimeRangeContextProvider } from "@/contexts/TimeRangeContextProvider";
import { QueryFiltersContextProvider } from "@/contexts/QueryFiltersContextProvider";
import { SettingsProvider } from "@/contexts/SettingsProvider";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteId } from "@/app/actions";
import { getDashboardSettingsAction } from "@/app/actions/settings";

type DashboardProviderProps = {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const dashboardId = useDashboardId();
  
  const { data: siteId } = useQuery({
    queryKey: ['siteId', dashboardId],
    queryFn: () => fetchSiteId(dashboardId)
  });

  const { data: initialSettings } = useQuery({
    queryKey: ['dashboard-settings', dashboardId],
    queryFn: () => getDashboardSettingsAction(dashboardId),
  });

  useEffect(() => {
    if (!siteId) {
      return () => {}
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = "http://localhost:3001/analytics.js";
    script.setAttribute('data-site-id', siteId);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [siteId]);

  if (!initialSettings) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <SettingsProvider initialSettings={initialSettings} dashboardId={dashboardId}>
      <TimeRangeContextProvider>
        <QueryFiltersContextProvider>
          {children}
        </QueryFiltersContextProvider>
      </TimeRangeContextProvider>
    </SettingsProvider>
  )
}