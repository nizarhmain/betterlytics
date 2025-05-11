import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Funnel } from '@/entities/funnels';

interface FunnelsTableProps {
  data: Funnel[];
}

export default function FunnelsTable({ data }: FunnelsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">All Funnels</h2>
      <p className="text-sm text-gray-500 mb-4">Analytics for all tracked funnels</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead># Steps</TableHead>
              <TableHead>Bounce Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((funnel) => (
              <TableRow key={funnel.name}>
                <TableCell className="font-medium">{funnel.name}</TableCell>
                <TableCell className="text-gray-500">{funnel.pages.length}</TableCell>
                <TableCell>10%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 