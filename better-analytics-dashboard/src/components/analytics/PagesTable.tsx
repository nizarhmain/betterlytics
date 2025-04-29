import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PageAnalytics } from '@/types/analytics';

interface PagesTableProps {
  data: PageAnalytics[];
}

export default function PagesTable({ data }: PagesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">All Pages</h2>
      <p className="text-sm text-gray-500 mb-4">Analytics for all tracked pages</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Pageviews</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
              <TableHead className="text-right">Avg. Time</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((page) => (
              <TableRow key={page.path}>
                <TableCell className="font-medium">{page.path}</TableCell>
                <TableCell className="text-gray-500">{page.title}</TableCell>
                <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{page.pageviews.toLocaleString()}</TableCell>
                <TableCell className="text-right">{page.bounceRate}%</TableCell>
                <TableCell className="text-right">{page.avgTime}</TableCell>
                <TableCell className="text-right">{page.conversion}%</TableCell>
                <TableCell className="text-right">
                  <Link href={page.path} className="text-gray-400 hover:text-gray-600">
                    <ArrowUpRight size={16} />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 