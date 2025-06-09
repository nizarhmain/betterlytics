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
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { EventLogItem } from '@/app/dashboard/[dashboardId]/events/EventLogItem';
import { EventLogEntry } from '@/entities/events';
import { ScrollArea } from '@/components/ui/scroll-area';

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
            <EventTrackingShowcaseCard />

            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className='dark:metric-card dark:shadow-card-glow'>
                <CardHeader>
                  <CardTitle className='text-xl'>Feature {index + 4}</CardTitle>
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

export function EventTrackingShowcaseCard() {
  const mockEvents: EventLogEntry[] = useMemo(
    () => [
      {
        event_name: 'Button Click',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'desktop',
        browser: 'chrome',
        country_code: 'US',
        url: 'https://example.com/landing-page',
        custom_event_json: JSON.stringify({ button_id: 'hero-cta', position: 'above-fold' }),
      },
      {
        event_name: 'Page View',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'mobile',
        browser: 'safari',
        country_code: 'CA',
        url: 'https://example.com/pricing',
        custom_event_json: JSON.stringify({ referrer: 'google.com' }),
      },
      {
        event_name: 'Form Submit',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'tablet',
        browser: 'firefox',
        country_code: 'GB',
        url: 'https://example.com/contact',
        custom_event_json: JSON.stringify({ form_type: 'contact', success: true }),
      },
      {
        event_name: 'Video Play',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'desktop',
        browser: 'edge',
        country_code: 'DE',
        url: 'https://example.com/features',
        custom_event_json: JSON.stringify({ video_id: 'demo-video', duration: 120 }),
      },
      {
        event_name: 'Download',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'mobile',
        browser: 'chrome',
        country_code: 'FR',
        url: 'https://example.com/resources',
        custom_event_json: JSON.stringify({ file_type: 'pdf', file_name: 'whitepaper.pdf' }),
      },
      {
        event_name: 'Search',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'desktop',
        browser: 'safari',
        country_code: 'AU',
        url: 'https://example.com/search',
        custom_event_json: JSON.stringify({ query: 'analytics dashboard', results_count: 24 }),
      },
      {
        event_name: 'Newsletter Signup',
        timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'mobile',
        browser: 'firefox',
        country_code: 'JP',
        url: 'https://example.com/blog',
        custom_event_json: JSON.stringify({ source: 'blog-footer', email_domain: 'gmail.com' }),
      },
      {
        event_name: 'Add to Cart',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        visitor_id: '',
        device_type: 'tablet',
        browser: 'chrome',
        country_code: 'BR',
        url: 'https://example.com/shop',
        custom_event_json: JSON.stringify({ product_id: 'analytics-pro', price: 99 }),
      },
    ],
    [],
  );

  const LiveIndicator = () => (
    <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50'>
      <div className='absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-400' />
    </div>
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow relative overflow-hidden'>
      <CardHeader className='pb-0'>
        <CardTitle className='flex items-center gap-3 text-xl'>
          <div className='bg-muted/50 border-border/30 relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border'>
            <Clock className='text-primary h-4 w-4' />
            <LiveIndicator />
          </div>
          Real-time Events
        </CardTitle>
        <CardDescription className='text-base'>
          Track every user interaction as it happens with detailed event logging.
        </CardDescription>
      </CardHeader>

      <CardContent className='p-0'>
        <ScrollArea className='h-64'>
          <div className='divide-border/60 divide-y'>
            {mockEvents.map((event, index) => (
              <EventLogItem key={`${event.timestamp}-${index}`} event={event} />
            ))}
          </div>
        </ScrollArea>

        <div className='border-border/60 mt-4 border-t pt-3'>
          <div className='text-muted-foreground text-center text-xs'>Showing 8 of 1,247 events</div>
        </div>
      </CardContent>
    </Card>
  );
}
