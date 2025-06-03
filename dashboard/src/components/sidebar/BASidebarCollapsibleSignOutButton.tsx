"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export default function BASidebarCollapsibleSignOutButton() {
  const { state } = useSidebar();
  
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant='outline'
      disabled={state === "collapsed"}
      className={cn("overflow-hidden", state === "collapsed" && "collapse")}
    >
      Sign Out
    </Button>
  );
} 