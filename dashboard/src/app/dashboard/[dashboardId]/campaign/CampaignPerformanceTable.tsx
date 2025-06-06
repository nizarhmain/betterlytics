import React from 'react';
import { CampaignPerformance } from '@/entities/campaign';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { getBounceRateColor } from '@/utils/bounceRateColors';
import { formatPercentage } from '@/utils/formatters';

interface CampaignPerformanceTableProps {
  data: CampaignPerformance[];
}

const columns: ColumnDef<CampaignPerformance>[] = [
  {
    accessorKey: 'name',
    header: 'Campaign Name',
    cell: ({ row }) => (
      <div className='truncate font-medium' title={row.original.name}>
        {row.original.name}
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: 'visitors',
    header: 'Visitors',
    cell: ({ row }) => <div>{row.original.visitors.toLocaleString()}</div>,
  },
  {
    accessorKey: 'bounceRate',
    header: 'Bounce Rate',
    cell: ({ row }) => (
      <div className={`font-medium ${getBounceRateColor(row.original.bounceRate)}`}>
        {formatPercentage(row.original.bounceRate)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'avgSessionDuration',
    header: 'Avg. Session Duration',
    cell: ({ row }) => <div>{row.original.avgSessionDuration}</div>,
    size: 180,
  },
  {
    accessorKey: 'pagesPerSession',
    header: 'Pages / Session',
    cell: ({ row }) => <div>{row.original.pagesPerSession.toFixed(1)}</div>,
    size: 150,
  },
];

export default function CampaignPerformanceTable({ data }: CampaignPerformanceTableProps) {
  return (
    <div className='bg-card border-border rounded-lg border p-6 shadow'>
      <h2 className='text-foreground mb-1 text-lg font-bold'>Campaign Performance</h2>
      <p className='text-muted-foreground mb-4 text-sm'>Key metrics for your campaigns</p>
      <DataTable columns={columns} data={data} defaultSorting={[{ id: 'visitors', desc: true }]} />
    </div>
  );
}
