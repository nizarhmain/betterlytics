'use client';

import { ArrowUpRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { PageAnalytics } from '@/entities/pages';
import { formatDuration } from '@/utils/dateFormatters';
import { FilterPreservingLink } from '@/components/ui/FilterPreservingLink';
import { useNavigateWithFilters } from '@/hooks/use-navigate-with-filters';

interface PagesTableProps {
  data: PageAnalytics[];
}

const generatePageDetailUrl = (path: string): string => {
  return `/dashboard/pages/page-detail?path=${encodeURIComponent(path)}`;
};

const formatPath = (path: string): string => {
  return path || '/';
};

export default function PagesTable({ data }: PagesTableProps) {
  const { navigate } = useNavigateWithFilters();

  const columns: ColumnDef<PageAnalytics>[] = [
    {
      accessorKey: 'path',
      header: 'Path',
      cell: ({ row }) => formatPath(row.original.path),
    },
    {
      accessorKey: 'visitors',
      header: 'Visitors',
      cell: ({ row }) => row.original.visitors.toLocaleString(),
    },
    {
      accessorKey: 'pageviews',
      header: 'Pageviews',
      cell: ({ row }) => row.original.pageviews.toLocaleString(),
    },
    {
      accessorKey: 'bounceRate',
      header: 'Bounce Rate',
      cell: ({ row }) => `${row.original.bounceRate}%`,
    },
    {
      accessorKey: 'avgTime',
      header: 'Avg. Time',
      cell: ({ row }) => formatDuration(row.original.avgTime),
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        const pageDetailUrl = generatePageDetailUrl(row.original.path);
        return (
          <FilterPreservingLink
            href={pageDetailUrl}
            className='flex justify-end text-gray-400 hover:text-gray-600'
            onClick={(e) => e.stopPropagation()} // Prevent row click from firing
          >
            <ArrowUpRight size={16} />
          </FilterPreservingLink>
        );
      },
      enableSorting: false,
    },
  ];

  const handleRowClick = (row: PageAnalytics) => {
    const pageDetailUrl = generatePageDetailUrl(row.path);
    navigate(pageDetailUrl);
  };

  return (
    <div className='bg-card border-border rounded-lg border p-6 shadow'>
      <h2 className='text-foreground mb-1 text-lg font-bold'>All Pages</h2>
      <p className='text-muted-foreground mb-4 text-sm'>Analytics for all tracked pages</p>
      <div className='overflow-x-auto'>
        <DataTable
          columns={columns}
          data={data}
          defaultSorting={[{ id: 'pageviews', desc: true }]}
          onRowClick={(row) => handleRowClick(row.original)}
        />
      </div>
    </div>
  );
}
