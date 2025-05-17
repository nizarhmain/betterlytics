'use client';

import React from 'react';
import { CampaignLandingPagePerformanceItem } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignLandingPagePerformanceTableProps {
  data: CampaignLandingPagePerformanceItem[];
  isLoading: boolean;
}

export default function CampaignLandingPagePerformanceTable({
  data,
  isLoading,
}: CampaignLandingPagePerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3>Campaign Landing Page Performance</h3>
        <p>Key metrics for campaign landing pages</p>
        <div className="text-center py-4">Loading landing page performance data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3>Campaign Landing Page Performance</h3>
        <p>Key metrics for campaign landing pages</p>
        <div className="text-center py-4">No landing page performance data available for the selected period.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-3">
      <h3>Campaign Landing Page Performance</h3>
      <p>Key metrics for campaign landing pages</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Landing Page URL</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => ( // Added index for key, as campaignName + landingPageUrl might not be unique
              <TableRow key={`${item.campaignName}-${item.landingPageUrl}-${index}`}>
                <TableCell className="font-medium">{item.campaignName}</TableCell>
                <TableCell>
                  <a href={item.landingPageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs" title={item.landingPageUrl}>
                    {item.landingPageUrl}
                  </a>
                </TableCell>
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