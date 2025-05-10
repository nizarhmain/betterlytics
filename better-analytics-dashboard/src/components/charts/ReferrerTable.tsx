'use client';

import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatNumber, formatPercentage } from "@/utils/formatters";
import { formatDuration } from "@/utils/dateFormatters";
import { ReferrerTableRow } from '@/entities/referrers';

export enum ReferrerTab {
  All = 'all',
  Search = 'search',
  Social = 'social',
  Direct = 'direct',
  Email = 'email',
  Other = 'other'
}

interface ReferrerTableProps {
  data?: ReferrerTableRow[];
  loading: boolean;
}

export default function ReferrerTable({ data = [], loading }: ReferrerTableProps) {
  const [activeTab, setActiveTab] = useState<ReferrerTab>(ReferrerTab.All);

  // Calculate total visits for percentage
  const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);
  
  // Filter data based on active tab
  const filteredData = data.filter(row => {
    if (activeTab === ReferrerTab.All) return true;
    return row.source === activeTab;
  });
  
  return (
    <div>
      <div className="border-b mb-4">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: ReferrerTab.All, label: 'All' },
            { id: ReferrerTab.Search, label: 'Search' },
            { id: ReferrerTab.Social, label: 'Social' },
            { id: ReferrerTab.Direct, label: 'Direct' },
            { id: ReferrerTab.Email, label: 'Email' },
            { id: ReferrerTab.Other, label: 'Other' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-gray-800 text-gray-800' 
                  : 'border-transparent hover:border-gray-300 text-gray-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Bounce Rate</TableHead>
              <TableHead>Avg. Visit Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
                <TableRow key={index}>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{formatNumber(row.visits)}</TableCell>
                  <TableCell>{formatPercentage((row.visits / totalVisits) * 100)}</TableCell>
                  <TableCell>{formatPercentage(row.bounce_rate)}</TableCell>
                  <TableCell>{formatDuration(row.avg_visit_duration)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
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