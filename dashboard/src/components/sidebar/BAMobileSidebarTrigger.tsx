"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";



export default function BAMobileSidebarTrigger() {

  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Button
      variant='outline'
      className={cn("fixed bottom-10 left-6 z-50", !isMobile && "hidden")}
      onClick={toggleSidebar}
    >
      <MenuIcon />
    </Button>
  )
}
