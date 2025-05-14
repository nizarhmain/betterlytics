'use client';

import { useQuery } from '@tanstack/react-query';
import { CreateFunnelDialog } from "./CreateFunnelDialog";
import { Funnel } from "@/entities/funnels";
import { fetchFunnelsAction } from "@/app/actions/funnels";
import { FunnelDataContent } from './FunnelDataContent';

export default function FunnelsClient() {
  const { data: funnels = [], isLoading: funnelsLoading } = useQuery<Funnel[]>({
    queryKey: ['funnels', 'default-site'],
    queryFn: () => fetchFunnelsAction('default-site'),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Funnels</h1>
          <p className="text-sm text-gray-500">Funnels for your website</p>
        </div>
        <div className="relative inline-block text-left">
          <CreateFunnelDialog />
        </div>
      </div>
      {
        funnels.length === 0 && (<div>No funnels yet...</div>)
      }
      {
        funnels
          .map((funnel) => (
            <FunnelDataContent key={funnel.id} funnel={funnel} />
          ))
      }
    </div>
  );
} 