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
        <Table className="min-w-full text-left border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-gray-700 font-semibold">Page</TableHead>
              <TableHead className="px-4 py-2 text-gray-700 font-semibold">Visitors</TableHead>
              <TableHead className="px-4 py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.url} className="bg-white hover:bg-gray-50">
                <TableCell className="px-4 py-2 font-mono text-blue-700">{page.url}</TableCell>
                <TableCell className="px-4 py-2">{page.visitors.toLocaleString()}</TableCell>
                <TableCell className="px-4 py-2">
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