'use client';

import React from 'react';
import { CampaignMediumBreakdownItem } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignMediumEngagementTableProps {
  data: CampaignMediumBreakdownItem[];
  isLoading: boolean;
}

export default function CampaignMediumEngagementTable({
  data,
  isLoading,
}: CampaignMediumEngagementTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Medium Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign medium</p>
        <div className="text-center py-4">Loading medium engagement data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Medium Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign medium</p>
        <div className="text-center py-4">No medium engagement data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Medium Engagement Metrics</h2>
      <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign medium</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medium</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.medium}>
                <TableCell className="font-medium">{item.medium}</TableCell>
                <TableCell className="text-right">{item.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.bounceRate.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{item.avgSessionDuration}</TableCell>
                <TableCell className="text-right">{item.pagesPerSession.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 