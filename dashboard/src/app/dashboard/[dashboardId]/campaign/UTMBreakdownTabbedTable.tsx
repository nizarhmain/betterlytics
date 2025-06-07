'use client';

import { use, useMemo, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TabbedTable, { TabDefinition } from '@/components/TabbedTable';
import { formatPercentage } from '@/utils/formatters';
import {
  fetchCampaignSourceBreakdownAction,
  fetchCampaignMediumBreakdownAction,
  fetchCampaignContentBreakdownAction,
  fetchCampaignTermBreakdownAction,
} from '@/app/actions';

type UTMBreakdownTabbedTableProps = {
  sourceBreakdownPromise: ReturnType<typeof fetchCampaignSourceBreakdownAction>;
  mediumBreakdownPromise: ReturnType<typeof fetchCampaignMediumBreakdownAction>;
  contentBreakdownPromise: ReturnType<typeof fetchCampaignContentBreakdownAction>;
  termBreakdownPromise: ReturnType<typeof fetchCampaignTermBreakdownAction>;
};

interface BaseUTMBreakdownItem {
  visitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  pagesPerSession: number;
  [key: string]: string | number;
}

export default function UTMBreakdownTabbedTable({
  sourceBreakdownPromise,
  mediumBreakdownPromise,
  contentBreakdownPromise,
  termBreakdownPromise,
}: UTMBreakdownTabbedTableProps) {
  const sourceBreakdown = use(sourceBreakdownPromise);
  const mediumBreakdown = use(mediumBreakdownPromise);
  const contentBreakdown = use(contentBreakdownPromise);
  const termBreakdown = use(termBreakdownPromise);

  const createUTMColumns = useCallback(
    (dataKey: string, dataKeyHeader: string): ColumnDef<BaseUTMBreakdownItem>[] => {
      return [
        {
          accessorKey: dataKey,
          header: dataKeyHeader,
          cell: ({ row }) => <div className='font-medium'>{String(row.getValue(dataKey))}</div>,
        },
        {
          accessorKey: 'visitors',
          header: 'Visitors',
          cell: ({ row }) => <div>{row.getValue<number>('visitors').toLocaleString()}</div>,
        },
        {
          accessorKey: 'bounceRate',
          header: 'Bounce Rate',
          cell: ({ row }) => <div>{formatPercentage(row.getValue<number>('bounceRate'))}</div>,
        },
        {
          accessorKey: 'avgSessionDuration',
          header: 'Avg. Session Duration',
          cell: ({ row }) => <div>{row.getValue('avgSessionDuration')}</div>,
        },
        {
          accessorKey: 'pagesPerSession',
          header: 'Pages / Session',
          cell: ({ row }) => <div>{row.getValue<number>('pagesPerSession').toFixed(1)}</div>,
        },
      ];
    },
    [],
  );

  const sourceColumns = useMemo(() => createUTMColumns('source', 'Source'), [createUTMColumns]);
  const mediumColumns = useMemo(() => createUTMColumns('medium', 'Medium'), [createUTMColumns]);
  const contentColumns = useMemo(() => createUTMColumns('content', 'Content'), [createUTMColumns]);
  const termColumns = useMemo(() => createUTMColumns('term', 'Term/Keyword'), [createUTMColumns]);

  const tabs: TabDefinition<BaseUTMBreakdownItem>[] = useMemo(
    () => [
      {
        key: 'source',
        label: 'Source',
        data: sourceBreakdown as BaseUTMBreakdownItem[],
        columns: sourceColumns,
        defaultSorting: [{ id: 'visitors', desc: true }],
        emptyMessage: 'No source breakdown data available for campaigns',
      },
      {
        key: 'medium',
        label: 'Medium',
        data: mediumBreakdown as BaseUTMBreakdownItem[],
        columns: mediumColumns,
        defaultSorting: [{ id: 'visitors', desc: true }],
        emptyMessage: 'No medium breakdown data available for campaigns',
      },
      {
        key: 'content',
        label: 'Content',
        data: contentBreakdown as BaseUTMBreakdownItem[],
        columns: contentColumns,
        defaultSorting: [{ id: 'visitors', desc: true }],
        emptyMessage: 'No content breakdown data available for campaigns',
      },
      {
        key: 'term',
        label: 'Terms',
        data: termBreakdown as BaseUTMBreakdownItem[],
        columns: termColumns,
        defaultSorting: [{ id: 'visitors', desc: true }],
        emptyMessage: 'No term breakdown data available for campaigns',
      },
    ],
    [
      sourceBreakdown,
      mediumBreakdown,
      contentBreakdown,
      termBreakdown,
      sourceColumns,
      mediumColumns,
      contentColumns,
      termColumns,
    ],
  );

  return (
    <TabbedTable
      title='UTM Parameter Breakdown'
      description='Campaign performance across different UTM parameters'
      tabs={tabs}
      defaultTab='source'
    />
  );
}
