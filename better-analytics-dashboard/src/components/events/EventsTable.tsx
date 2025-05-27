'use client';

import React, { useState, useMemo } from 'react';
import { Activity, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { ColumnDef, SortingState, useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { EventTypeRow } from "@/entities/events";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ExpandedEventContent } from './ExpandedEventContent';
import { calculatePercentage } from '@/utils/mathUtils';
import { formatTimeAgo } from '@/utils/dateFormatters';
import { formatPercentage } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface EventsTableProps {
  data: EventTypeRow[];
  isLoading?: boolean;
}

interface ExpandedRowState {
  [eventName: string]: {
    isExpanded: boolean;
    expandedProperties: Set<string>;
  };
}

interface EventRowWithExpansion extends EventTypeRow {
  isExpanded: boolean;
  totalEvents: number;
}

export function EventsTable({ data, isLoading = false }: EventsTableProps) {
  const { startDate, endDate } = useTimeRangeContext();
  const { queryFilters } = useQueryFiltersContext();
  const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'count', desc: true }]);
  
  const totalEvents = data.reduce((sum, event) => sum + event.count, 0);

  const toggleRow = (eventName: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [eventName]: {
        isExpanded: !prev[eventName]?.isExpanded,
        expandedProperties: new Set(),
      }
    }));
  };

  const toggleProperty = (eventName: string, propertyName: string) => {
    setExpandedRows(prev => {
      const currentState = prev[eventName] || { isExpanded: true, expandedProperties: new Set() };
      const newExpandedProperties = new Set(currentState.expandedProperties);
      
      newExpandedProperties.has(propertyName) 
        ? newExpandedProperties.delete(propertyName)
        : newExpandedProperties.add(propertyName);

      return {
        ...prev,
        [eventName]: {
          ...currentState,
          expandedProperties: newExpandedProperties,
        }
      };
    });
  };

  const tableData = useMemo(() => {
    return data.map(event => ({
      ...event,
      isExpanded: expandedRows[event.event_name]?.isExpanded || false,
      totalEvents,
    }));
  }, [data, expandedRows, totalEvents]);

  const columns: ColumnDef<EventRowWithExpansion>[] = useMemo(() => [
    {
      accessorKey: 'event_name',
      header: 'Event Name',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-4 h-4">
              {event.isExpanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className={cn(
              "font-medium transition-colors duration-100",
              event.isExpanded ? "text-primary" : "text-foreground"
            )}>
              {event.event_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'count',
      header: 'Count',
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm flex items-center justify-end">
          <span>{row.original.count.toLocaleString()}</span>
          <div className="w-4 h-4 ml-2" />
        </div>
      ),
    },
    {
      accessorKey: 'unique_users',
      header: 'Unique Users',
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm flex items-center justify-end">
          <span>{row.original.unique_users.toLocaleString()}</span>
          <div className="w-4 h-4 ml-2" />
        </div>
      ),
    },
    {
      accessorKey: 'avg_per_user',
      header: 'Avg per User',
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm flex items-center justify-end">
          <span>{row.original.avg_per_user}</span>
          <div className="w-4 h-4 ml-2" />
        </div>
      ),
    },
    {
      accessorKey: 'last_seen',
      header: 'Last Seen',
      cell: ({ row }) => {
        const timeAgo = formatTimeAgo(new Date(row.original.last_seen));
        
        return (
          <div className="text-right text-sm flex items-center justify-end">
            <span className="text-muted-foreground">{timeAgo}</span>
            <div className="w-4 h-4 ml-2" />
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.last_seen).getTime();
        const dateB = new Date(rowB.original.last_seen).getTime();
        return dateA - dateB;
      },
    },
    {
      id: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => {
        const percentage = calculatePercentage(row.original.count, row.original.totalEvents);
        return (
          <div className="text-right font-mono text-sm flex items-center justify-end">
            <span>{formatPercentage(percentage)}</span>
            <div className="w-4 h-4 ml-2" />
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const percentageA = calculatePercentage(rowA.original.count, rowA.original.totalEvents);
        const percentageB = calculatePercentage(rowB.original.count, rowB.original.totalEvents);
        return percentageA - percentageB;
      },
    },
  ], []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <span>Event Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Spinner />
            <p className="text-sm text-muted-foreground">Loading events data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">No events found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              No custom events were tracked during this time period. Events will appear here once they start being recorded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <span>Event Details</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {data.length} {data.length === 1 ? 'Unique Event' : 'Unique Events'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-slate-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-slate-700">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400",
                        header.column.getCanSort() && "cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-slate-700",
                        header.id === 'event_name' ? "text-left" : "text-right"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={cn(
                        "flex items-center",
                        header.id === 'event_name' ? "justify-start" : "justify-end"
                      )}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <div className="w-4 h-4 flex items-center justify-center ml-2">
                            {header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="size-4" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="size-4" />
                            ) : (
                              <div className="size-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {table.getRowModel().rows.map((row) => {
                const event = row.original;
                const isExpanded = event.isExpanded;
                
                return (
                  <React.Fragment key={row.id}>
                    <TableRow 
                      className={cn(
                        "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50",
                        isExpanded && "bg-primary/5"
                      )}
                      onClick={() => toggleRow(event.event_name)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    {isExpanded && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={columns.length}>
                          <ExpandedEventContent
                            event={event}
                            expandedProperties={expandedRows[event.event_name]?.expandedProperties || new Set()}
                            onToggleProperty={(propertyName) => toggleProperty(event.event_name, propertyName)}
                            startDate={startDate}
                            endDate={endDate}
                            queryFilters={queryFilters}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 