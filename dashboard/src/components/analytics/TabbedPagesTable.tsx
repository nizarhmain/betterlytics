'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageAnalytics } from '@/entities/pages';
import { formatDuration } from '@/utils/dateFormatters';
import { useMemo } from 'react';

interface TabbedPagesTableProps {
  allPagesData: PageAnalytics[];
  entryPagesData: PageAnalytics[];
  exitPagesData: PageAnalytics[];
}

const formatPath = (path: string): string => {
  return path || '/';
};

export default function TabbedPagesTable({ allPagesData, entryPagesData, exitPagesData }: TabbedPagesTableProps) {
  const getColumns = (excludeColumns: string[] = []): ColumnDef<PageAnalytics>[] => {
    const allColumns = [
      {
        accessorKey: 'path',
        header: 'Path',
        cell: ({ row }: { row: { original: PageAnalytics } }) => formatPath(row.original.path),
      },
      {
        accessorKey: 'visitors',
        header: 'Visitors',
        cell: ({ row }: { row: { original: PageAnalytics } }) => row.original.visitors.toLocaleString(),
      },
      {
        accessorKey: 'pageviews',
        header: 'Pageviews',
        cell: ({ row }: { row: { original: PageAnalytics } }) => row.original.pageviews.toLocaleString(),
      },
      {
        accessorKey: 'bounceRate',
        header: 'Bounce Rate',
        cell: ({ row }: { row: { original: PageAnalytics } }) => `${row.original.bounceRate}%`,
      },
      {
        accessorKey: 'avgTime',
        header: 'Avg. Time',
        cell: ({ row }: { row: { original: PageAnalytics } }) => formatDuration(row.original.avgTime),
      },
    ];

    return allColumns.filter((column) => !excludeColumns.includes(column.accessorKey as string));
  };

  const allPagesColumns = useMemo(() => getColumns(), []);
  const entryPagesColumns = useMemo(() => getColumns(), []);
  const exitPagesColumns = useMemo(() => getColumns(['bounceRate']), []);

  return (
    <Card className='bg-card border-border rounded-lg border shadow'>
      <Tabs defaultValue='all'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col items-center justify-between sm:flex-row'>
            <div>
              <CardTitle className='mb-1 text-lg font-semibold'>Page Analytics</CardTitle>
              <p className='text-muted-foreground text-sm'>Analytics for all tracked pages</p>
            </div>
            <TabsList className='bg-muted/30 grid h-8 w-auto grid-cols-3'>
              <TabsTrigger value='all' className='px-3 py-1 text-xs font-medium'>
                All Pages
              </TabsTrigger>
              <TabsTrigger value='entry' className='px-3 py-1 text-xs font-medium'>
                Entry Pages
              </TabsTrigger>
              <TabsTrigger value='exit' className='px-3 py-1 text-xs font-medium'>
                Exit Pages
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className='px-6 pt-0 pb-4'>
          <TabsContent value='all'>
            <div>
              <div className='overflow-x-auto'>
                <DataTable
                  columns={allPagesColumns}
                  data={allPagesData}
                  defaultSorting={[{ id: 'pageviews', desc: true }]}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='entry'>
            <div className='overflow-x-auto'>
              <DataTable
                columns={entryPagesColumns}
                data={entryPagesData}
                defaultSorting={[{ id: 'pageviews', desc: true }]}
              />
            </div>
          </TabsContent>

          <TabsContent value='exit'>
            <div className='overflow-x-auto'>
              <DataTable
                columns={exitPagesColumns}
                data={exitPagesData}
                defaultSorting={[{ id: 'pageviews', desc: true }]}
              />
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
