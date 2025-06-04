"use client";

import TimeRangeSelector from "@/components/TimeRangeSelector";
import QueryFiltersSelector from "@/components/filters/QueryFiltersSelector";

export default function DashboardFilters() {
  return (
    <div className="flex justify-end gap-4">
      <QueryFiltersSelector />
      <TimeRangeSelector />
    </div>
  );
} 