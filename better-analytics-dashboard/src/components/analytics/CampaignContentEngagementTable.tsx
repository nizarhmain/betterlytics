'use client';

import React from 'react';
import { CampaignContentBreakdownItem } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignContentEngagementTableProps {
  data: CampaignContentBreakdownItem[];
  isLoading: boolean;
}

export default function CampaignContentEngagementTable({
  data,
  isLoading,
}: CampaignContentEngagementTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3>Content Engagement Metrics</h3>
        <p>Engagement details for each campaign content</p>
        <div className="text-center py-4">Loading content engagement data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3>Content Engagement Metrics</h3>
        <p>Engagement details for each campaign content</p>
        <div className="text-center py-4">No content engagement data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3>Content Engagement Metrics</h3>
      <p>Engagement details for each campaign content</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.content}>
                <TableCell className="font-medium">{item.content}</TableCell>
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