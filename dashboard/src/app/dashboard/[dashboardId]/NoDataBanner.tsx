'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, Settings } from 'lucide-react';
import { IntegrationSheet } from '@/components/integration/IntegrationSheet';
import { useTrackingVerification } from '@/hooks/use-tracking-verification';

export function NoDataBanner() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isVerified, isLoading } = useTrackingVerification();

  if (isLoading || isVerified || isDismissed) {
    return null;
  }

  return (
    <>
      <div className='mb-6'>
        <div className='flex items-start gap-3 rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-800/30 dark:bg-amber-950/20'>
          <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400' />
          <div className='flex-1'>
            <p className='mb-1 text-sm font-medium text-amber-800 dark:text-amber-200'>Integration Required</p>
            <p className='text-muted-foreground mb-4 text-sm'>
              Your dashboard is ready, but we&apos;re not receiving any analytics data yet. Complete the
              integration setup to start tracking visitors.
            </p>
            <div className='flex gap-3'>
              <Button size='sm' onClick={() => setIsSheetOpen(true)} className='gap-2'>
                <Settings className='h-4 w-4' />
                Setup Integration
              </Button>
              <Button size='sm' variant='outline' onClick={() => setIsDismissed(true)}>
                Dismiss
              </Button>
            </div>
          </div>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => setIsDismissed(true)}
            className='text-muted-foreground hover:text-foreground h-8 w-8 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <IntegrationSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
