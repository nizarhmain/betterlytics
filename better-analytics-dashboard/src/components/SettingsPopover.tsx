"use client";

import Link from 'next/link';
import { Moon, Settings as SettingsIcon, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useDashboardId } from '@/hooks/use-dashboard-id';

interface SettingsPopoverProps {
  onClose: () => void;
}

export default function SettingsPopover({ onClose }: SettingsPopoverProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const dashboardId = useDashboardId();

  return (
    <div className="w-72 bg-popover shadow-lg rounded-md border border-border text-popover-foreground">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-semibold">Quick Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X size={18} />
        </Button>
      </div>

      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-theme-toggle" className="flex items-center gap-2 cursor-pointer">
            <Moon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Dark Theme</span>
          </Label>
          <Switch 
            id="dark-theme-toggle"
            checked={isDarkTheme} 
            onCheckedChange={setIsDarkTheme} 
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-theme-toggle" className="flex items-center gap-2 cursor-pointer">
            <Moon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Dark Theme</span>
          </Label>
          <Switch 
            id="dark-theme-toggle"
            checked={isDarkTheme} 
            onCheckedChange={setIsDarkTheme} 
          />
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Link 
          href={`/dashboard/${dashboardId}/settings`}
          onClick={onClose}
          className="flex items-center gap-2 w-full text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
        >
          <SettingsIcon size={16} />
          <span>Advanced Settings</span>
        </Link>
      </div>
    </div>
  );
} 