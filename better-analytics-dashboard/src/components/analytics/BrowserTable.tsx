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
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="py-3 text-foreground font-medium">Browser</TableHead>
                <TableHead className="py-3 text-foreground font-medium text-right">Visitors</TableHead>
                <TableHead className="py-3 text-foreground font-medium text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((browserStat) => (
                <TableRow key={browserStat.browser} className="border-b border-border last:border-b-0">
                  <TableCell className="py-4 font-medium text-foreground">
                    {browserStat.browser}
                  </TableCell>
                  <TableCell className="py-4 text-foreground text-right">
                    {browserStat.visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 text-foreground text-right">
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