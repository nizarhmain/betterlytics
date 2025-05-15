'use client';

import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { getRangeForValue } from "@/utils/timeRanges";
import SummaryCard from "@/components/SummaryCard";
import { fetchPageDetailAction } from "@/app/actions/pages";
import { PageAnalytics } from "@/entities/pages";
import { formatDuration } from "@/utils/dateFormatters";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";

interface PageDetailClientProps {
  path: string;
}

export default function PageDetailClient({ path }: PageDetailClientProps) {
  const { range } = useTimeRangeContext();
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);

  const { data: pageDetail, isLoading } = useQuery<PageAnalytics | null>({
    queryKey: ['pageDetail', 'default-site', path, startDate, endDate],
    queryFn: () => fetchPageDetailAction('default-site', path, startDate, endDate),
  });

  const displayTitle = path;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pages" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Page Details</h1>
        </div>
        
        <TimeRangeSelector />
      </div>

      <h2 className="text-xl font-semibold mb-6 ml-1 break-all">{displayTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Visitors"
          value={isLoading ? '...' : (pageDetail?.visitors.toLocaleString() || '0')}
          changeText=""
        />
        <SummaryCard
          title="Page Views"
          value={isLoading ? '...' : (pageDetail?.pageviews.toLocaleString() || '0')}
          changeText=""
        />
        <SummaryCard
          title="Bounce Rate"
          value={isLoading ? '...' : `${pageDetail?.bounceRate || 0}%`}
          changeText=""
        />
        <SummaryCard
          title="Avg. Time on Page"
          value={isLoading ? '...' : formatDuration(pageDetail?.avgTime || 0)}
          changeText=""
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Traffic Over Time</h2>
        <div className="text-gray-500 text-center py-8">
          Chart placeholder
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Referral Sources</h2>
        <div className="text-gray-500 text-center py-8">
          Referral sources placeholder
        </div>
      </div>
    </div>
  );
} 