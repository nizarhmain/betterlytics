import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Funnel, FunnelDetails } from "@/entities/funnels";
import { useQuery } from "@tanstack/react-query";

type FunnelDataContentProps = {
  funnel: Funnel;
};

export function FunnelDataContent({ funnel }: FunnelDataContentProps) {
  
  const { data: funnelDetails, isLoading: funnelDetailsLoading } = useQuery<FunnelDetails>({
    queryKey: ['funnel', 'default-site', funnel.id],
    queryFn: () => fetchFunnelDetailsAction('default-site', funnel.id),
  });

  if (funnelDetailsLoading || !funnelDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="py-3 text-gray-700 font-medium">Page</TableHead>
            <TableHead className="py-3 text-gray-700 font-medium text-right">Visitors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funnelDetails.pages.map((page, index) => (
            <TableRow key={page} className="border-b last:border-b-0">
              <TableCell className="py-4 font-medium text-gray-900">
                {page}
              </TableCell>
              <TableCell className="py-4 text-gray-900 text-right">
                {funnelDetails.visitors[index]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
