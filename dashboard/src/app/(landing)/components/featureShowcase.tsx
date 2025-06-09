'use client';

import {
  Link,
  Monitor,
  Flag,
  Globe,
  Laptop,
  Zap,
  ExternalLink,
  ArrowRight,
  Tag,
  Megaphone,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

export function FeatureShowcase() {
  return (
    <section className='bg-card/20 py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
            <span className='text-blue-600 dark:text-blue-400'>Powerful features</span> at your fingertips
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Explore the full arsenal of analytics capabilities
          </p>
        </div>

        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <AdvancedFiltersCard />
            <FunnelShowcaseCard />

            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className='dark:metric-card dark:shadow-card-glow'>
                <CardHeader>
                  <CardTitle className='text-xl'>Feature {index + 3}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-muted-foreground flex h-32 items-center justify-center'>
                    <span className='text-lg'>Placeholder</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className='mt-8 flex justify-center'>
          <Button variant='outline' size='lg'>
            Explore All Features
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function AdvancedFiltersCard() {
  const filterCategories = useMemo(
    () => [
      { name: 'URL', icon: <Link className='h-4 w-4' /> },
      { name: 'Device Type', icon: <Monitor className='h-4 w-4' /> },
      { name: 'Country Code', icon: <Flag className='h-4 w-4' /> },
      { name: 'Browser', icon: <Globe className='h-4 w-4' /> },
      { name: 'Operating System', icon: <Laptop className='h-4 w-4' /> },
      { name: 'Event Name', icon: <Zap className='h-4 w-4' /> },
      { name: 'Referrer Source', icon: <ExternalLink className='h-4 w-4' /> },
      { name: 'Referrer Medium', icon: <ArrowRight className='h-4 w-4' /> },
      { name: 'UTM Source', icon: <Tag className='h-4 w-4' /> },
      { name: 'UTM Medium', icon: <Megaphone className='h-4 w-4' /> },
      { name: 'UTM Campaign', icon: <Target className='h-4 w-4' /> },
    ],
    [],
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow'>
      <CardHeader>
        <CardTitle className='text-xl'>Advanced Filters</CardTitle>
        <CardDescription className='text-base'>
          Slice and dice your analytics data by any dimension to uncover actionable insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {filterCategories.slice(0, 12).map((filter, index) => (
            <div
              key={index}
              className='bg-card/80 border-border/50 flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-sm'
            >
              {filter.icon}
              <span>{filter.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FunnelShowcaseCard() {
  const funnelSteps = useMemo(
    () => [
      { name: 'Read Blog Post', conversion: 100, dropOff: 60.0 },
      { name: 'Click CTA', conversion: 40, dropOff: 30.0 },
      { name: 'View Landing Page', conversion: 28, dropOff: 16.3 },
      { name: 'Start Form', conversion: 15, dropOff: null },
    ],
    [],
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow'>
      <CardHeader>
        <CardTitle className='text-xl'>Funnels</CardTitle>
        <CardDescription className='text-base'>
          Track the conversion rate of your website's key user journeys.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {funnelSteps.map((step, index) => (
          <div key={index} className='space-y-1'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>{step.name}</span>
              <span className='text-sm font-bold'>{step.conversion}%</span>
            </div>
            <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
              <div className='bg-primary h-full' style={{ width: `${step.conversion}%` }} />
            </div>
            {step.dropOff && (
              <div className='text-muted-foreground flex items-center text-xs'>
                <TrendingDown className='mr-1 h-3 w-3' />
                <span>{step.dropOff}% drop off</span>
              </div>
            )}
          </div>
        ))}

        <div className='border-border mt-4 border-t pt-3'>
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium'>Total: 15%</span>
            <div className='flex items-center text-green-500'>
              <TrendingUp className='mr-1 h-3 w-3' />
              <span>2.3% since last week</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
