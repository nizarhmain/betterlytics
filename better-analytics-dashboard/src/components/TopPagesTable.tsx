import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TopPagesTableProps {
  pages: { url: string; visitors: number }[];
}

export default function TopPagesTable({ pages }: TopPagesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Top Pages</h2>
      <p className="text-sm text-gray-500 mb-4">Most visited pages</p>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="py-3 text-gray-700 font-medium">Page</TableHead>
              <TableHead className="py-3 text-gray-700 font-medium">Visitors</TableHead>
              <TableHead className="py-3 text-gray-700 font-medium w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.url} className="border-b last:border-b-0">
                <TableCell className="py-4 font-mono text-blue-700">{page.url}</TableCell>
                <TableCell className="py-4">{page.visitors.toLocaleString()}</TableCell>
                <TableCell className="py-4">
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="link"
                    tabIndex={0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 