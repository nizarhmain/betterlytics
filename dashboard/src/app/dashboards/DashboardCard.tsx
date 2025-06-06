import Link from 'next/link';
import { Dashboard } from '@/entities/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Globe, Calendar } from 'lucide-react';

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

  return (
    <Link href={`/dashboard/${dashboard.id}`}>
      <Card className='group hover:border-primary/30 border-border/50 h-full cursor-pointer transition-all duration-200 hover:shadow-lg'>
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
            <ExternalLink className='text-muted-foreground h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <Calendar className='h-3 w-3' />
              <span>Created {formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
