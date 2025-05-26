"use client";

import SettingsPopover from './SettingsPopover';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useDashboardId } from "@/hooks/use-dashboard-id";

export default function SettingsButton() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const dashboardId = useDashboardId();

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground text-sm font-medium w-full"
        >
          <Settings size={18} />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-lg" side="top" align="start">
        <SettingsPopover dashboardId={dashboardId} onClose={() => setIsPopoverOpen(false)} />
      </PopoverContent>
    </Popover>
  );
} 