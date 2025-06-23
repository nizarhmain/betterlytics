'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';

export default function BAMobileSidebarTrigger() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <div className='bg-background fixed bottom-10 left-6 z-20 h-fit w-fit rounded-md'>
      <Button variant='outline' className={cn(!isMobile && 'hidden')} onClick={toggleSidebar}>
        <MenuIcon />
      </Button>
    </div>
  );
}
