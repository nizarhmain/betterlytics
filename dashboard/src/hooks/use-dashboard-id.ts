"use client";

import { useParams } from "next/navigation";

export function useDashboardId() {
  const params = useParams();
  return params.dashboardId as string;
}
