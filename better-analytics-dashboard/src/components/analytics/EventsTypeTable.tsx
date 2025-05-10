'use client';

import { EventTypeRow } from "@/entities/events";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface EventsTableProps {
  data: EventTypeRow[];
}

export default function EventsTable({ data }: EventsTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="py-3 text-gray-700 font-medium">Event</TableHead>
                <TableHead className="py-3 text-gray-700 font-medium text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((eventStat) => (
                <TableRow key={eventStat.event_name} className="border-b last:border-b-0">
                  <TableCell className="py-4 font-medium text-gray-900">
                    {eventStat.event_name}
                  </TableCell>
                  <TableCell className="py-4 text-gray-900 text-right">
                    {eventStat.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 