'use client';

import React from 'react';
import { CampaignSourceBreakdownItem } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignSourceEngagementTableProps {
  data: CampaignSourceBreakdownItem[];
  isLoading: boolean;
}

export default function CampaignSourceEngagementTable({
  data,
  isLoading,
}: CampaignSourceEngagementTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Source Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign source</p>
        <div className="text-center py-4">Loading source engagement data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Source Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign source</p>
        <div className="text-center py-4">No source engagement data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Source Engagement Metrics</h2>
      <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign source</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.source}>
                <TableCell className="font-medium">{item.source}</TableCell>
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