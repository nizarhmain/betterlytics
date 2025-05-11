import { fetchFunnelDetailsAction } from "@/app/actions/funnels";
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

  if (funnelDetailsLoading) {
    return <div>Loading...</div>;
  }

  console.log("Details:", funnelDetails);

  return (
    <div>Hello!</div>
  );
}
