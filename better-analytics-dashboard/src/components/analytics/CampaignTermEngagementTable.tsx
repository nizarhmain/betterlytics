'use client';

import React from 'react';
import { CampaignTermBreakdownItem } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignTermEngagementTableProps {
  data: CampaignTermBreakdownItem[];
  isLoading: boolean;
}

export default function CampaignTermEngagementTable({
  data,
  isLoading,
}: CampaignTermEngagementTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Term/Keyword Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign term/keyword</p>
        <div className="text-center py-4">Loading term/keyword engagement data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Term/Keyword Engagement Metrics</h2>
        <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign term/keyword</p>
        <div className="text-center py-4">No term/keyword engagement data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Term/Keyword Engagement Metrics</h2>
      <p className="text-sm text-gray-500 mb-4">Engagement details for each campaign term/keyword</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Term/Keyword</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.term}>
                <TableCell className="font-medium">{item.term}</TableCell>
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