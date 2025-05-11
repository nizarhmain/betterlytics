"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Funnel } from "@/entities/funnels";
import { useState } from "react";
import { FunnelDataContent } from "./FunnelDataContent";

type CollapsibleFunnelDataProps = {
  funnel: Funnel;
};

export function CollapsibleFunnelData({ funnel }: CollapsibleFunnelDataProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CollapsibleTrigger asChild>
        <Button variant='outline'>{funnel.name}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="">
        <FunnelDataContent funnel={funnel} />
      </CollapsibleContent>
    </Collapsible>
  );
}
