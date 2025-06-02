'use client';

import Link from 'next/link';
import { Moon, Settings as SettingsIcon, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDashboardId } from '@/hooks/use-dashboard-id';

interface SettingsPopoverProps {
  onClose: () => void;
}

export default function SettingsPopover({ onClose }: SettingsPopoverProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const dashboardId = useDashboardId();

  return (
    <div className='bg-popover border-border text-popover-foreground w-72 rounded-md border shadow-lg'>
      <div className='border-border flex items-center justify-between border-b p-3'>
        <h3 className='text-sm font-semibold'>Quick Settings</h3>
        <Button variant='ghost' size='icon' onClick={onClose} className='rounded-full'>
          <X size={18} />
        </Button>
      </div>

      <div className='space-y-4 p-3'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='dark-theme-toggle' className='flex cursor-pointer items-center gap-2'>
            <Moon size={16} className='text-muted-foreground' />
            <span className='text-foreground text-sm font-medium'>Dark Theme</span>
          </Label>
          <Switch id='dark-theme-toggle' checked={isDarkTheme} onCheckedChange={setIsDarkTheme} />
        </div>

        <div className='flex items-center justify-between'>
          <Label htmlFor='dark-theme-toggle' className='flex cursor-pointer items-center gap-2'>
            <Moon size={16} className='text-muted-foreground' />
            <span className='text-foreground text-sm font-medium'>Dark Theme</span>
          </Label>
          <Switch id='dark-theme-toggle' checked={isDarkTheme} onCheckedChange={setIsDarkTheme} />
        </div>
      </div>

      <div className='border-border border-t p-3'>
        <Link
          href={`/dashboard/${dashboardId}/settings`}
          onClick={onClose}
          className='text-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors'
        >
          <SettingsIcon size={16} />
          <span>Advanced Settings</span>
        </Link>
      </div>
    </div>
  );
}
