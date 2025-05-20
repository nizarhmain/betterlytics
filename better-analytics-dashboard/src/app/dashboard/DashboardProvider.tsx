"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from 'next-auth/react';
import { TimeRangeContextProvider } from "@/contexts/TimeRangeContextProvider";

interface DashboardContextType {
  dashboardId: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

type DashboardProviderProps = {
  children: React.ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return null; 
  }

  const dashboardId = session?.user?.dashboardId;

  if (!dashboardId) {
    throw new Error("Dashboard ID is missing from session even after successful authentication. Check auth.ts configuration.");
  }

  return (
    <DashboardContext.Provider value={{ dashboardId }}>
      <TimeRangeContextProvider>
        {children}
      </TimeRangeContextProvider>
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
