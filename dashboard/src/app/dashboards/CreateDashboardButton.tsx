'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateDashboardDialog } from './CreateDashboardDialog';

export default function CreateDashboardButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <>
      <Button variant='outline' onClick={() => setIsDialogOpen(true)} className='gap-2'>
        <Plus className='h-4 w-4' />
        Create Dashboard
      </Button>

      <CreateDashboardDialog open={isDialogOpen} onOpenChange={handleDialogClose} />
    </>
  );
}
