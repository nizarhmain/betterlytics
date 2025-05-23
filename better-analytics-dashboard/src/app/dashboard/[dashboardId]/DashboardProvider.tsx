"use client";

import React, { useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimeRangeContextProvider } from "@/contexts/TimeRangeContextProvider";
import { QueryFiltersContextProvider } from "@/contexts/QueryFiltersContextProvider";

function getDashboardDefaultQueryFunction(dashboardId: string) {
  return async function defaultQueryFunction<T extends { queryKey: unknown }>({ queryKey }: T) {
    
    if (!Array.isArray(queryKey)) {
      throw 'queryKey only must be an array';
    }
    
    if (queryKey.length === 0) {
      throw 'queryKey must be defined';
    }
    
    const executor = queryKey[0];
    if (typeof executor !== 'function') {
      throw 'queryKey must be an executor';
    }
    
    
    return executor(dashboardId);
  }
}

type DashboardProviderProps = {
  dashboardId: string;
  children: React.ReactNode;
}

export function DashboardProvider({ children, dashboardId }: DashboardProviderProps) {
  const queryClient = useMemo(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 30  , // 30 minutes
          refetchOnWindowFocus: false,
          queryFn: getDashboardDefaultQueryFunction(dashboardId)
        },
      },
    }),
    [dashboardId]
  );

  return (
    <QueryClientProvider client={queryClient} >
      <TimeRangeContextProvider>
        <QueryFiltersContextProvider>
          {children}
        </QueryFiltersContextProvider>
      </TimeRangeContextProvider>
    </QueryClientProvider>
  )
}