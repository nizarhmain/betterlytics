import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Funnel, FunnelDetails } from "@/entities/funnels";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type FunnelDataContentProps = {
  funnel: Funnel;
};

export function FunnelDataContent({ funnel }: FunnelDataContentProps) {
  
  const { data: funnelDetails, isLoading: funnelDetailsLoading } = useQuery<FunnelDetails>({
    queryKey: ['funnel', 'default-site', funnel.id],
    queryFn: () => fetchFunnelDetailsAction('default-site', funnel.id),
  });

  const chartData = useMemo(() => {
    if (!funnelDetails) {
      return [];
    }

    return funnelDetails.pages.map((page, index) => ({ page, visitors: funnelDetails.visitors[index] }));
  }, [funnelDetails])

  if (funnelDetailsLoading || !funnelDetails) {
    return <div>Loading...</div>;
  }

  console.log(chartData)

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={chartData} margin={{ top: 0, bottom: 0, left: 300, right: 500}}>
          <XAxis type="number" />
          <YAxis dataKey="page" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="visitors" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
