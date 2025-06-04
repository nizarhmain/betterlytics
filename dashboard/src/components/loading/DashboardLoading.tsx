import React from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardLoading() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <Spinner size='lg' />
        </div>
        <h2 className='text-foreground mb-2 text-lg font-semibold'>Initializing Dashboard</h2>
        <p className='text-muted-foreground text-sm'>Loading your dashboard settings...</p>
      </div>
    </div>
  );
}
