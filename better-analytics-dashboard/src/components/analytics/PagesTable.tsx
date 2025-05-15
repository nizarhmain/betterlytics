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
import { PageAnalytics } from "@/entities/pages";
import { formatDuration } from '@/utils/dateFormatters';

interface PagesTableProps {
  data: PageAnalytics[];
}

export default function PagesTable({ data }: PagesTableProps) {
  const generatePageDetailUrl = (path: string): string => {
    return `/dashboard/pages/page-detail?path=${encodeURIComponent(path)}`;
  };

  const formatPath = (path: string): string => {
    return path || "/";
  };

  return (
    <div className="bg-card rounded-lg shadow border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-1">All Pages</h2>
      <p className="text-sm text-muted-foreground mb-4">Analytics for all tracked pages</p>
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((page) => {
              const pageDetailUrl = generatePageDetailUrl(page.path);
              
              return (
                <TableRow 
                  key={page.path} 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => window.location.href = pageDetailUrl}
                >
                  <TableCell className="font-medium">{formatPath(page.path)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatPath(page.path)}</TableCell>
                  <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.pageviews.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{page.bounceRate}%</TableCell>
                  <TableCell className="text-right">{formatDuration(page.avgTime)}</TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={pageDetailUrl} 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 