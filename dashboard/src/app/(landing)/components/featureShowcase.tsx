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
import LeafletMap from '@/components/LeafletMap';
import { GeoVisitor } from '@/entities/geography';
import { formatPercentage } from '@/utils/formatters';

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
            <UserJourneyShowcaseCard />
            <WorldMapShowcaseCard />
            <TrafficSourcesShowcaseCard />
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

export function UserJourneyShowcaseCard() {
  const journeyData = useMemo(
    () => ({
      start: { name: 'Landing Page', users: 1000 },
      middle: { name: 'Product Page', users: 650 },
      pathA: [
        { name: 'Add to Cart', users: 320 },
        { name: 'Checkout', users: 180 },
      ],
      pathB: [
        { name: 'Search', users: 330 },
        { name: 'Compare', users: 120 },
      ],
    }),
    [],
  );

  const JourneyNode = ({ name, users, isStart }: { name: string; users: number; isStart?: boolean }) => (
    <div className='flex flex-col items-center'>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium ${
          isStart ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted/50 border-border/30'
        }`}
      >
        {users}
      </div>
      <div className='mt-1 text-center'>
        <div className='text-xs font-medium'>{name}</div>
      </div>
    </div>
  );

  const VerticalArrow = () => (
    <div className='flex justify-center py-1'>
      <div className='bg-border h-4 w-px'></div>
    </div>
  );

  const BranchingConnector = () => (
    <div className='relative flex h-8 w-full justify-center'>
      <div className='bg-border absolute top-0 h-4 w-px'></div>
      <div className='bg-border absolute top-4 right-2/9 left-2/9 h-px'></div>
      <div className='bg-border absolute top-4 left-2/9 h-4 w-px'></div>
      <div className='bg-border absolute top-4 right-2/9 h-4 w-px'></div>
    </div>
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-xl'>User Journeys</CardTitle>
        <CardDescription className='text-base'>
          Track multiple user paths and see how visitors navigate through your site.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='flex flex-col items-center'>
          <JourneyNode name={journeyData.start.name} users={journeyData.start.users} isStart />
          <VerticalArrow />
          <JourneyNode name={journeyData.middle.name} users={journeyData.middle.users} />
          <BranchingConnector />
          <div className='grid w-full grid-cols-2 gap-8'>
            <div className='flex flex-col items-center space-y-1'>
              {journeyData.pathA.map((step, index) => (
                <div key={step.name} className='flex flex-col items-center space-y-1'>
                  <JourneyNode name={step.name} users={step.users} />
                  {index < journeyData.pathA.length - 1 && <VerticalArrow />}
                </div>
              ))}
            </div>
            <div className='flex flex-col items-center space-y-1'>
              {journeyData.pathB.map((step, index) => (
                <div key={step.name} className='flex flex-col items-center space-y-1'>
                  <JourneyNode name={step.name} users={step.users} />
                  {index < journeyData.pathB.length - 1 && <VerticalArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorldMapShowcaseCard() {
  const mockGeographyData: GeoVisitor[] = useMemo(
    () => [
      { country_code: 'USA', visitors: 1247 },
      { country_code: 'GBR', visitors: 892 },
      { country_code: 'DNK', visitors: 743 },
      { country_code: 'FRA', visitors: 621 },
      { country_code: 'CAN', visitors: 534 },
      { country_code: 'AUS', visitors: 398 },
      { country_code: 'JPN', visitors: 287 },
      { country_code: 'BRA', visitors: 234 },
      { country_code: 'IND', visitors: 198 },
      { country_code: 'ESP', visitors: 156 },
      { country_code: 'ITA', visitors: 134 },
      { country_code: 'NLD', visitors: 98 },
      { country_code: 'SWE', visitors: 67 },
      { country_code: 'NOR', visitors: 45 },
    ],
    [],
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-xl'>Geographical Analytics</CardTitle>
        <CardDescription className='text-base'>
          See where your visitors are coming from around the world.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='border-border/30 h-64 w-full overflow-hidden rounded-lg border'>
          <LeafletMap
            visitorData={mockGeographyData}
            showZoomControls={false}
            showLegend={false}
            initialZoom={1}
            maxVisitors={1247}
          />
        </div>

        <div className='border-border/60 border-t pt-3'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Top Countries</span>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span className='text-xs font-medium'>US: 1,247</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='bg-primary/60 h-2 w-2 rounded-full'></div>
                <span className='text-xs font-medium'>GB: 892</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrafficSourcesShowcaseCard() {
  const trafficSources = useMemo(
    () => [
      {
        name: 'Google Search',
        visitors: 3247,
        percentage: 42.8,
        icon: (
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500'>
            <span className='text-xs font-bold text-white'>G</span>
          </div>
        ),
        color: 'bg-blue-500',
      },
      {
        name: 'Direct',
        visitors: 1834,
        percentage: 24.2,
        icon: (
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-600'>
            <Globe className='h-3 w-3 text-white' />
          </div>
        ),
        color: 'bg-gray-600',
      },
      {
        name: 'Social Media',
        visitors: 1456,
        percentage: 19.2,
        icon: (
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-pink-500'>
            <span className='text-xs font-bold text-white'>S</span>
          </div>
        ),
        color: 'bg-pink-500',
      },
      {
        name: 'Email',
        visitors: 678,
        percentage: 8.9,
        icon: (
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
            <span className='text-xs font-bold text-white'>@</span>
          </div>
        ),
        color: 'bg-green-500',
      },
      {
        name: 'Other',
        visitors: 365,
        percentage: 4.9,
        icon: (
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
            <ExternalLink className='h-3 w-3 text-white' />
          </div>
        ),
        color: 'bg-orange-500',
      },
    ],
    [],
  );

  const SourceItem = ({ source }: { source: (typeof trafficSources)[0] }) => (
    <div className='flex items-center justify-between space-x-3'>
      <div className='flex items-center space-x-3'>
        {source.icon}
        <div>
          <div className='text-sm font-medium'>{source.name}</div>
          <div className='text-muted-foreground text-xs'>{source.visitors.toLocaleString()} visitors</div>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <span className='text-sm font-medium'>{formatPercentage(source.percentage)}</span>
        <div className='bg-muted h-2 w-16 overflow-hidden rounded-full'>
          <div
            className={`h-full ${source.color}`}
            style={{ width: `${formatPercentage(Math.min(source.percentage * 2, 100))}` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className='dark:metric-card dark:shadow-card-glow'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-xl'>Traffic Sources</CardTitle>
        <CardDescription className='text-base'>
          Discover where your visitors are arriving from and optimize your marketing efforts.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {trafficSources.map((source, index) => (
            <SourceItem key={index} source={source} />
          ))}
        </div>

        <div className='border-border/60 border-t pt-3'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Total Visitors</span>
            <div className='text-primary flex items-center'>
              <span className='font-medium'>7,580 this month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
