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
    <div className="rounded-lg border bg-white">
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="py-3 text-gray-700 font-medium">Browser</TableHead>
                <TableHead className="py-3 text-gray-700 font-medium text-right">Visitors</TableHead>
                <TableHead className="py-3 text-gray-700 font-medium text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((browserStat) => (
                <TableRow key={browserStat.browser} className="border-b last:border-b-0">
                  <TableCell className="py-4 font-medium text-gray-900">
                    {browserStat.browser}
                  </TableCell>
                  <TableCell className="py-4 text-gray-900 text-right">
                    {browserStat.visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 text-gray-900 text-right">
                    {browserStat.percentage}%
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