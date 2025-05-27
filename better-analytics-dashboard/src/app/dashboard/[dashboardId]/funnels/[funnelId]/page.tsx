import { FunnelDataContent } from "./FunnelDataContent";

type FunnelPageProps = {
  params: Promise<{ funnelId: string }>;
}

export default async function FunnelPage({ params }: FunnelPageProps) {
  const { funnelId } = await params;
  return <FunnelDataContent funnelId={funnelId} />;
} 