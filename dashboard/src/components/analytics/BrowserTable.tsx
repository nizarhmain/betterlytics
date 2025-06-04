'use client';

import { BrowserStats } from '@/entities/devices';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface BrowserTableProps {
  data: BrowserStats[];
}

export default function BrowserTable({ data }: BrowserTableProps) {
  const columns: ColumnDef<BrowserStats>[] = [
    {
      accessorKey: 'browser',
      header: 'Browser',
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
