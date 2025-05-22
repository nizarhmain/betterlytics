"use client";

import React from "react"

import { TimeRangeContextProvider } from "@/contexts/TimeRangeContextProvider";
import { QueryFiltersContextProvider } from "@/contexts/QueryFiltersContextProvider";

type DashboardProviderProps = {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {

  return (
    <TimeRangeContextProvider>
      <QueryFiltersContextProvider>
        {children}
      </QueryFiltersContextProvider>
    </TimeRangeContextProvider>
  )
}
