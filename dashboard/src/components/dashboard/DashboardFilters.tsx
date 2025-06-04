"use client";

import TimeRangeSelector from "@/components/TimeRangeSelector";
import QueryFiltersSelector from "@/components/filters/QueryFiltersSelector";

export default function DashboardFilters() {
  return (
    <div className="flex flex-col justify-end gap-x-4 gap-y-1 md:flex-row">
      <QueryFiltersSelector />
      <TimeRangeSelector />
    </div>
  );
} 