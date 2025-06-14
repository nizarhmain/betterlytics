'use client';

import { useEffect, useState } from 'react';
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap } from 'lucide-react';
import { getUserBillingData } from '@/actions/billing';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

export default function UserUsageSettings() {
  const [billingData, setBillingData] = useState<Awaited<ReturnType<typeof getUserBillingData>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const data = await getUserBillingData();
        setBillingData(data);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Spinner />
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>Unable to load usage data</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Usage & Plan</h3>
        <p className='text-muted-foreground text-sm'>
          Monitor your current usage and manage your subscription plan.
        </p>
      </div>

      <CurrentPlanCard {...billingData} />

      <div className='bg-card flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h4 className='flex items-center gap-2 text-sm font-medium'>
            <Zap className='text-primary h-4 w-4' />
            Need more events?
          </h4>
          <p className='text-muted-foreground text-sm'>
            Upgrade your plan to get more events and unlock additional features.
          </p>
        </div>
        <Button asChild size='sm'>
          <Link href='/billing'>
            <ExternalLink className='mr-2 h-4 w-4' />
            View Plans
          </Link>
        </Button>
      </div>

      {billingData.usage.isOverLimit && (
        <div className='border-destructive/20 bg-destructive/5 rounded-lg border p-4'>
          <div className='flex items-start gap-3'>
            <div className='bg-destructive/10 rounded-full p-1'>
              <Zap className='text-destructive h-4 w-4' />
            </div>
            <div className='space-y-1'>
              <h4 className='text-destructive text-sm font-medium'>Usage limit exceeded</h4>
              <p className='text-destructive/80 text-sm'>
                You've exceeded your monthly event limit. Upgrade your plan to continue tracking all your analytics
                data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
