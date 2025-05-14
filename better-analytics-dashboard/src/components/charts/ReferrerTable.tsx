'use client';

import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatNumber, formatPercentage } from "@/utils/formatters";
import { formatDuration } from "@/utils/dateFormatters";
import { ReferrerTableRow } from '@/entities/referrers';
import { getReferrerColor } from '@/utils/referrerColors';
import { Globe, Link } from 'lucide-react';

export const ReferrerTab = {
  All: 'all',
  Search: 'search',
  Social: 'social',
  Direct: 'direct',
  Email: 'email',
  Other: 'other'
} as const;

export type ReferrerTabKey = typeof ReferrerTab[keyof typeof ReferrerTab];

export type ReferrerTabValue = keyof typeof ReferrerTab;

interface ReferrerTableProps {
  data?: ReferrerTableRow[];
  loading: boolean;
}

// Component to render a badge for referrer types
const SourceTypeBadge = ({ type }: { type: string }) => {
  const color = getReferrerColor(type);
  
  const bgColorStyle = {
    backgroundColor: `${color}33`, // 20% opacity (33 hex = ~20% opacity)
    color: color,
    border: `1px solid ${color}80`,  // 50% opacity border (80 hex = 50% opacity)
  };
  
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-bold"
      style={bgColorStyle}
    >
      {type}
    </span>
  );
};

export default function ReferrerTable({ data = [], loading }: ReferrerTableProps) {
  const [activeTab, setActiveTab] = useState<ReferrerTabKey>(ReferrerTab.All);
  
  // Calculate total visits for percentage
  const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);
  
  // Filter data based on active tab
  const filteredData = data.filter(row => {
    if (activeTab === ReferrerTab.All) return true;
    return row.source_type.toLowerCase() === activeTab.toLowerCase();
  });
  
  return (
    <div>
      <div className="border-b mb-4">
        <div className="flex space-x-4 overflow-x-auto">
          {(Object.entries(ReferrerTab) as [ReferrerTabValue, ReferrerTabKey][]).map(([key, value]) => (
            <button
              key={value}
              className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === value 
                  ? 'border-gray-800 text-gray-800' 
                  : 'border-transparent hover:border-gray-300 text-gray-600'
              }`}
              onClick={() => setActiveTab(value)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Bounce Rate</TableHead>
              <TableHead>Avg. Visit Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-gray-500">Loading data...</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow 
                  key={index}
                  className="h-16 hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {row.source_type.toLowerCase() === 'direct' ? (
                        <Globe className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Link className="h-4 w-4 text-gray-500" />
                      )}
                      {
                        row.source_url ? 
                          row.source_url : 
                          (row.source_type.toLowerCase() === 'direct' ? 
                            'Direct' : 
                            row.source_name || row.source_type)
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <SourceTypeBadge type={row.source_type} />
                  </TableCell>
                  <TableCell>{formatNumber(row.visits)}</TableCell>
                  <TableCell>{formatPercentage((row.visits / totalVisits) * 100)}</TableCell>
                  <TableCell>{formatPercentage(row.bounce_rate)}</TableCell>
                  <TableCell>{formatDuration(row.avg_visit_duration)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No data to display for {activeTab !== ReferrerTab.All ? activeTab : ''}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 