import React from 'react';

export default function DashboardLoading() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
        </div>
        <h2 className='text-foreground mb-2 text-lg font-semibold'>Initializing Dashboard</h2>
        <p className='text-muted-foreground text-sm'>Loading your dashboard settings...</p>
      </div>
    </div>
  );
}
