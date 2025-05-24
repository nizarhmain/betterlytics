"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IntegrationSheet } from "./IntegrationSheet";

const MOCK_SITE_ID = "default-site";

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
        siteId={MOCK_SITE_ID}
      />
    </>
  );
} 