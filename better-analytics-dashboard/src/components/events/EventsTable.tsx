'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { EventTypeRow } from "@/entities/events";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventRow } from './EventRow';

interface EventsTableProps {
  data: EventTypeRow[];
}

interface ExpandedRowState {
  [eventName: string]: {
    isExpanded: boolean;
    expandedProperties: Set<string>;
  };
}

export function EventsTable({ data }: EventsTableProps) {
  const { startDate, endDate } = useTimeRangeContext();
  const dashboardId = useDashboardId();
  const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
  
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
      
      if (newExpandedProperties.has(propertyName)) {
        newExpandedProperties.delete(propertyName);
      } else {
        newExpandedProperties.add(propertyName);
      }

      return {
        ...prev,
        [eventName]: {
          ...currentState,
          expandedProperties: newExpandedProperties,
        }
      };
    });
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">
              No custom events were tracked during this time period.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Event Name</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <EventRow
                key={event.event_name}
                event={event}
                totalEvents={totalEvents}
                isExpanded={expandedRows[event.event_name]?.isExpanded || false}
                expandedProperties={expandedRows[event.event_name]?.expandedProperties || new Set()}
                onToggle={() => toggleRow(event.event_name)}
                onToggleProperty={(propertyName) => toggleProperty(event.event_name, propertyName)}
                dashboardId={dashboardId}
                startDate={startDate}
                endDate={endDate}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 