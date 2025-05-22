'use client';

import { useMemo } from "react";
import { FunnelDetails } from "@/entities/funnels";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { analyzeFunnel } from "./analytics";
import { formatPercentage } from "@/utils/formatters";

type FunnelPreviewDisplayProps = {
  funnelDetails?: FunnelDetails;
  isLoading: boolean;
};

export function FunnelPreviewDisplay({ funnelDetails, isLoading }: FunnelPreviewDisplayProps) {
  
  const funnelData = useMemo(() => {
    return funnelDetails && analyzeFunnel(funnelDetails);
  }, [funnelDetails]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mb-2"></div>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (!funnelData || !funnelDetails || funnelDetails.pages.length === 0 || funnelDetails.pages.every(p => !p || p.trim() === '')) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Define funnel name and at least two page steps to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4 text-card-foreground">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold truncate" title={funnelDetails.name}>{funnelDetails.name}</h2>
        <Badge className="rounded-full h-[50%] mt-1 whitespace-nowrap" variant='outline'>{funnelData.steps.length} steps</Badge>  
      </div>
      {
        funnelData
          .steps
          .map((step, index) => (
            <div key={step.page + index} className="mb-2 last:mb-0">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <p className="flex justify-center items-center bg-muted text-muted-foreground size-6 rounded-full font-medium text-xs">{index+1}</p>
                  <p className="truncate" title={step.page}>{step.page}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground whitespace-nowrap">{step.visitors} users</p>
              </div>
              <div className="pl-9 pr-1 text-muted-foreground text-xs">
                <Progress
                  className="h-3"
                  value={100 * step.visitorsRatio}
                  color="#22C55E"
                />
                <div className="flex justify-between items-end mt-0.5">
                  <p>{step.visitors} users</p>
                  <p className="text-right">{formatPercentage(Math.floor(100 * step.visitorsRatio), 0)} total</p>
                </div>
                {index < funnelData.steps.length -1 && (
                  <>
                    <Progress
                      className="mt-1 h-2"
                      value={100 * step.dropoffRatio}
                      color="#F97315"
                    />
                    <div className="flex justify-between items-end mt-0.5">
                      <p>{step.dropoffCount} dropped</p>
                      <p className="text-right">{formatPercentage(Math.floor(100 * step.dropoffRatio), 0)} drop</p>
                    </div>
                  </>
                )}
              </div>
              {index < funnelData.steps.length -1 && <hr className="mt-2 mb-2 ml-9"/>}
            </div>
          ))
      }
    </div>
  );
} 