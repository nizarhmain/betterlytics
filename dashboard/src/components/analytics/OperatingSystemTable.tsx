'use client';

import { OperatingSystemStats } from '@/entities/devices';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { OSIcon } from '@/components/icons';

interface OperatingSystemTableProps {
  data: OperatingSystemStats[];
}

export default function OperatingSystemTable({ data }: OperatingSystemTableProps) {
  const columns: ColumnDef<OperatingSystemStats>[] = [
    {
      accessorKey: 'os',
      header: 'Operating System',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <OSIcon name={row.original.os} className='h-4 w-4' />
          <span>{row.original.os}</span>
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
