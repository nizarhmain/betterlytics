'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/entities/dashboard';
import DashboardCard from '@/app/dashboards/DashboardCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateDashboardDialog } from '@/app/dashboards/CreateDashboardDialog';

interface DashboardsClientWrapperProps {
  dashboards: Dashboard[];
}

export default function DashboardsClientWrapper({ dashboards: initialDashboards }: DashboardsClientWrapperProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <div className='container mx-auto max-w-7xl px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='mb-2 text-3xl font-bold tracking-tight'>Your Dashboards</h1>
          <p className='text-muted-foreground'>Manage and monitor analytics for all your websites.</p>
        </div>
        <Button variant='outline' onClick={() => setIsDialogOpen(true)} className='gap-2'>
          <Plus className='h-4 w-4' />
          Create Dashboard
        </Button>
      </div>

      {initialDashboards.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {initialDashboards.map((dashboard) => (
            <DashboardCard key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      ) : (
        <div className='py-16 text-center'>
          <div className='mx-auto max-w-md'>
            <h3 className='text-foreground mb-2 text-lg font-semibold'>No dashboards yet</h3>
            <p className='text-muted-foreground mb-6 text-sm'>
              Create your first dashboard to start tracking analytics for your website.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className='gap-2'>
              <Plus className='h-4 w-4' />
              Create Dashboard
            </Button>
          </div>
        </div>
      )}

      <CreateDashboardDialog open={isDialogOpen} onOpenChange={handleDialogClose} />
    </div>
  );
}
