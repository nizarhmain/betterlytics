'use client';

import Link from 'next/link';
import { Dashboard } from '@/entities/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Calendar, Settings } from 'lucide-react';

interface DashboardCardProps {
  dashboard: Dashboard;
}

export default function DashboardCard({ dashboard }: DashboardCardProps) {
  const formattedDate = dashboard.createdAt
    ? new Date(dashboard.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/dashboard/${dashboard.id}/settings`;
  };

  return (
    <Card className='group hover:border-primary/30 border-border/50 h-full cursor-pointer transition-all duration-200 hover:shadow-lg'>
      <Link href={`/dashboard/${dashboard.id}`} className='block h-full'>
        <CardHeader className='pb-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors'>
                <Globe className='text-primary h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <CardTitle className='group-hover:text-primary truncate text-lg font-semibold transition-colors'>
                  {dashboard.domain}
                </CardTitle>
                <p className='text-muted-foreground mt-1 text-sm'>{dashboard.siteId}</p>
              </div>
            </div>
            <div className='flex w-8 justify-center'>
              <ExternalLink className='text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex w-9 justify-center'>
                <Calendar className='text-muted-foreground h-3 w-3' />
              </div>
              <span className='text-muted-foreground text-xs'>Created {formattedDate}</span>
            </div>
            <div className='flex w-8 justify-center'>
              <Button
                variant='ghost'
                size='sm'
                className='hover:bg-muted h-8 w-8 cursor-pointer p-0'
                onClick={handleSettingsClick}
                title='Dashboard Settings'
              >
                <Settings className='text-muted-foreground h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
