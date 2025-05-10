"use client";

import React from "react"

import { TimeRangeContextProvider } from "@/contexts/TimeRangeContextProvider";

type DashboardProviderProps = {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {

  return (
    <TimeRangeContextProvider>
      {children}
    </TimeRangeContextProvider>
  )
}
