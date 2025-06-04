'use client';

import { OperatingSystemStats } from '@/entities/devices';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface OperatingSystemTableProps {
  data: OperatingSystemStats[];
}

export default function OperatingSystemTable({ data }: OperatingSystemTableProps) {
  const columns: ColumnDef<OperatingSystemStats>[] = [
    {
      accessorKey: 'os',
      header: 'Operating System',
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
