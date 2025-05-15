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
        <Badge className="rounded-full h-[50%] mt-1 text-gray-800" variant='outline'>{chartData.length} steps</Badge>  
      </div>
      <hr />
      <div className="grid grid-cols-3">
        <div className="col-span-2 text-sm font-semibold">
          {
            chartData
              .map(({ page, visitors }, index) => (
                <div className="mt-3" key={page}>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <p className="flex justify-center items-center bg-gray-200 size-6 rounded-full font-medium text-xs">{index+1}</p>
                      <p>{page}</p>
                    </div>
                    <p className="mt-3">{visitors} users</p>
                  </div>
                  <div className="p-3 text-gray-600">
                    <Progress
                      className="h-4"
                      value={100 * visitors / maxVisitors}
                      color="#22C55E"
                    />
                    <div className="flex justify-between items-end">
                      <p>{visitors} users</p>
                      <p className="text-right">{Math.floor(100 * visitors / maxVisitors)}%</p>
                    </div>
                    <Progress
                      className="mt-2"
                      value={100 - (100 * visitors / (chartData[index-1]?.visitors ?? maxVisitors))}
                      color="#F97315"
                    />
                    <div className="flex justify-between items-end">
                      <p>{(chartData[index-1]?.visitors ?? maxVisitors) - visitors} users dropped</p>
                      <p className="text-right">{Math.floor(100 - (100 * visitors / (chartData[index-1]?.visitors ?? maxVisitors)))}%</p>
                    </div>
                  </div>
                  <hr />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
