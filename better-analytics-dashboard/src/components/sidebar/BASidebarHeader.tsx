"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function BASidebarHeader() {
  const { open, isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="relative">
      {!isMobile && (
        <Button
          variant='ghost'
          className="absolute -right-2 top-2 rounded-sm size-6 bg-background border-1 border-l-0 hover:bg-background/80 hover:cursor-pointer"
          onClick={toggleSidebar}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Button>
      )}
    </div>
  );
} 