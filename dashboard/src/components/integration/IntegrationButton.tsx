"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IntegrationSheet } from "./IntegrationSheet";

export function IntegrationButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsSheetOpen(true)} variant="outline">
        Integration Setup
      </Button>
      <IntegrationSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
} 