import React from 'react';
import { CampaignPerformance } from "@/entities/campaign";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CampaignPerformanceTableProps {
  data: CampaignPerformance[];
  isLoading: boolean;
}

export default function CampaignPerformanceTable({
  data,
  isLoading,
}: CampaignPerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Campaign Performance</h2>
        <p className="text-sm text-gray-500 mb-4">Key metrics for your campaigns</p>
        <div className="text-center py-4">Loading campaign data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Campaign Performance</h2>
        <p className="text-sm text-gray-500 mb-4">Key metrics for your campaigns</p>
        <div className="text-center py-4">No campaign data available for the selected period.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Campaign Performance</h2>
      <p className="text-sm text-gray-500 mb-4">Key metrics for your campaigns</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Session Duration</TableHead>
              <TableHead className="text-right">Pages / Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((campaign) => (
              <TableRow key={campaign.name}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="text-right">{campaign.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{campaign.bounceRate.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{campaign.avgSessionDuration}</TableCell>
                <TableCell className="text-right">{campaign.pagesPerSession.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 