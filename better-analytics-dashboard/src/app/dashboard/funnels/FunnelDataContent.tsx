import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
import { Funnel, FunnelDetails } from "@/entities/funnels";
import { MultiProgress } from "@/components/MultiProgress";

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
      return 0;
    }

    return Math.max(...funnelDetails.visitors, 0);
  }, [funnelDetails])


  if (funnelDetailsLoading || !funnelDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {
        chartData
          .map(({ page, visitors }) => (
            <div key={page}>
              <h3>{page}</h3>
              <MultiProgress
                progresses={[
                  {
                    colorHex: "#06b6d4",
                    value: 2 * visitors,
                    name: "lost"
                  },
                  {
                    colorHex: "#FFb6d4",
                    value: visitors,
                    name: "visitors"
                  }
                ]}
                maxValue={3 * maxVisitors}
              />
            </div>
          ))
      }
    </div>
  );
}
