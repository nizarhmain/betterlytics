"use client";

import { useRouter } from "next/router";

export function useDashboardId() {
  const { query } = useRouter();
  return query.dashboardId as string;
}
