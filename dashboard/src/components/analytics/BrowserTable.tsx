'use client';

import { BrowserStats } from '@/entities/devices';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { BrowserIcon } from '@/components/icons';

interface BrowserTableProps {
  data: BrowserStats[];
}

export default function BrowserTable({ data }: BrowserTableProps) {
  const columns: ColumnDef<BrowserStats>[] = [
    {
      accessorKey: 'browser',
      header: 'Browser',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <BrowserIcon name={row.original.browser} className='h-4 w-4' />
          <span>{row.original.browser}</span>
        </div>
      ),
    },
    {
      accessorKey: 'visitors',
      header: 'Visitors',
      cell: ({ row }) => row.original.visitors.toLocaleString(),
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => `${row.original.percentage}%`,
    },
  ];

  return (
    <div className='overflow-x-auto'>
      <DataTable
        columns={columns}
        data={data}
        defaultSorting={[{ id: 'visitors', desc: true }]}
        className='w-full'
      />
    </div>
  );
}
