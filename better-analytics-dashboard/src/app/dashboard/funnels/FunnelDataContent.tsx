import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
import { Funnel, FunnelDetails } from "@/entities/funnels";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import SummaryCard from "@/components/SummaryCard";
import { ArrowRight } from "lucide-react";

type FunnelDataContentProps = {
  funnel: Funnel;
};

export function FunnelDataContent({ funnel }: FunnelDataContentProps) {
  
  const { data: funnelDetails, isLoading: funnelDetailsLoading } = useQuery<FunnelDetails>({
    queryKey: ['funnel', 'default-site', funnel.id],
    queryFn: () => fetchFunnelDetailsAction('default-site', funnel.id),
  });

  const chartData = useMemo(() => {
    return funnelDetails?.pages.map((page, index) => ({ page, visitors: funnelDetails.visitors[index] })) ?? [];
  }, [funnelDetails]);

  const [minVisitors, maxVisitors] = useMemo(() => {
    return [
      Math.min(...funnelDetails?.visitors ?? [0]),
      Math.max(...funnelDetails?.visitors ?? [1])
    ]
  }, [funnelDetails])

  const biggestDropOff = useMemo(() => {
    return chartData.reduce((max, curr, index, data) => {
      const previous = data[index-1] ?? { ...max };
      const currentPercentage = Math.max(
        100 - (100 * curr.visitors / (previous.visitors ?? max.visitors)),
        max.percentage
      )
      if (currentPercentage > max.percentage) {
        return {
          pages: [previous.page, curr.page],
          visitors: previous.visitors - curr.visitors,
          percentage: currentPercentage
        }
      }
      return max;
    }, { pages: ['/', '/'], visitors: maxVisitors, percentage: 0})
  }, [funnelDetails, maxVisitors])


  if (funnelDetailsLoading || !funnelDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white border-1 p-5 rounded-md grid grid-cols-3 gap-6">
      <div className="col-span-2 text-sm font-semibold">
        {
          chartData
            .map(({ page, visitors }, index) => (
              <div key={page}>
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
                    <p>{(chartData[index-1]?.visitors ?? maxVisitors) - visitors} users dropped-off</p>
                    <p className="text-right">{Math.floor(100 - (100 * visitors / (chartData[index-1]?.visitors ?? maxVisitors)))}%</p>
                  </div>
                </div>
                <hr />
              </div>
            ))
        }
      </div>
      <div className="col-span-1 text-sm border-l-1 pl-3 ">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-xl font-semibold">{funnelDetails.name}</h1>
          <Badge className="rounded-full h-[50%] mt-1 text-gray-800" variant='outline'>{chartData.length} steps</Badge>  
        </div>
        <div className="flex flex-col gap-3 bg-gray-200 p-4 rounded-lg">
          <SummaryCard
            title="Overall conversion"
            value={`${Math.floor(100 * minVisitors / maxVisitors)}%`}
            changeText={""}
          />
          <SummaryCard
            title="Total visitors"
            value={`${maxVisitors}`}
            changeText={""}
          />
          <SummaryCard
            title="Total completed"
            value={`${minVisitors}`}
            changeText={""}
          />
          <SummaryCard
            title="Biggest drop-off"
            value={<span className="text-sm flex text-ellipsis overflow-hidden">{biggestDropOff.pages[0]} <ArrowRight size="18px" /> {biggestDropOff.pages[1]}</span>}
            changeText={`${biggestDropOff.visitors} users (${biggestDropOff.percentage}%)`}
            changeColor="text-orange-600"
          />
        </div>
      </div>
    </div>
  );
}
