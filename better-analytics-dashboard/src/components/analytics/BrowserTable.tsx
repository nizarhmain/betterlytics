'use client';

import { BrowserStats } from "@/entities/devices";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface BrowserTableProps {
  data: BrowserStats[];
  isLoading: boolean;
}

export default function BrowserTable({ data, isLoading }: BrowserTableProps) {
  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full text-left border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-gray-700 font-semibold">Browser</TableHead>
            <TableHead className="px-4 py-2 text-gray-700 font-semibold text-right">Visitors</TableHead>
            <TableHead className="px-4 py-2 text-gray-700 font-semibold text-right">Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((browserStat) => (
            <TableRow key={browserStat.browser} className="bg-white hover:bg-gray-50">
              <TableCell className="px-4 py-2 font-medium text-gray-900">
                {browserStat.browser}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-500 text-right">
                {browserStat.visitors.toLocaleString()}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-500 text-right">
                {browserStat.percentage}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 