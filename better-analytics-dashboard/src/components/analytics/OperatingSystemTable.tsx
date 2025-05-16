'use client';

import { OperatingSystemStats } from "@/entities/devices";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface OperatingSystemTableProps {
  data: OperatingSystemStats[];
  isLoading: boolean;
}

export default function OperatingSystemTable({ data, isLoading }: OperatingSystemTableProps) {
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
                <TableHead className="py-3 text-gray-700 font-medium">Operating System</TableHead>
                <TableHead className="py-3 text-gray-700 font-medium text-right">Visitors</TableHead>
                <TableHead className="py-3 text-gray-700 font-medium text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((osStat) => (
                <TableRow key={osStat.os} className="border-b last:border-b-0">
                  <TableCell className="py-4 font-medium text-gray-900">
                    {osStat.os}
                  </TableCell>
                  <TableCell className="py-4 text-gray-900 text-right">
                    {osStat.visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 text-gray-900 text-right">
                    {osStat.percentage}%
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