import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
import { Funnel, FunnelDetails } from "@/entities/funnels";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  }, [funnelDetails]);

  const maxVisitors = useMemo(() => {
    if (!funnelDetails) {
      return 1;
    }

    return Math.max(...funnelDetails.visitors, 1);
  }, [funnelDetails])


  if (funnelDetailsLoading || !funnelDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white border-1 p-5 rounded-md">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-xl font-semibold">{funnelDetails.name}</h1>
        <Badge className="rounded-full h-[50%] mt-1" variant='outline'>{chartData.length} steps</Badge>  
      </div>
      <hr />
      <div className="flex flex-col gap-6 mt-5">
        {
          chartData
            .map(({ page, visitors }, index) => (
              <div key={page} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p className="flex justify-center items-center bg-gray-200 size-6 rounded-full text-sm">{index+1}</p>
                  <p className="font-semibold text-sm">{page}</p>
                </div>
                <p className="font-semibold text-sm">{visitors} users</p>
                <Progress
                  value={100 * visitors / maxVisitors}
                  color="#22C55E"
                />
                <p className="text-right font-semibold text-sm">{Math.floor(100 * visitors / maxVisitors)}%</p>
              </div>
            ))
        }
      </div>
    </div>
  );
}
