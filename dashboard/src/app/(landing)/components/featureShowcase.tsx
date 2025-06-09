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
            <span className='dark:gradient-text'>Powerful features</span> at your fingertips
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Explore the full arsenal of analytics capabilities
          </p>
        </div>

        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <AdvancedFiltersCard />

            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className='dark:metric-card dark:shadow-card-glow'>
                <CardHeader>
                  <CardTitle className='text-xl'>Feature {index + 2}</CardTitle>
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
