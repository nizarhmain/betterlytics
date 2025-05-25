"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function BASidebarHeader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { state, open, isMobile, toggleSidebar } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = theme === "light" ? "/betterlytics-logo-dark-simple.svg" : "/betterlytics-logo-light-simple.svg";

  return (
    <div className="pt-4 pl-2">
      <div className="flex items-center gap-2">
        {!mounted ? (
          <div style={{ width: 32, height: 32 }} />
        ) : (
          <Image
            key={theme}
            src={logoSrc}
            alt="Betterlytics Logo"
            width={32}
            height={32}
          />
        )}
        <div className={cn(state === "collapsed" && "hidden")}>
          <div className="font-bold text-sm text-foreground">Betterlytics</div>
        </div>
      </div>
      {
        !isMobile && (
          <Button
            variant='ghost'
            className="absolute -right-2 top-9 rounded-sm size-6 bg-background border-1 border-l-0 hover:bg-background/80 hover:cursor-pointer"
            onClick={toggleSidebar}
          >
            { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
          </Button>
        )
      }
    </div>
  );
} 