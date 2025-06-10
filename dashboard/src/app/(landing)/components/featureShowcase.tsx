import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AdvancedFiltersCard from './featureCards/advancedFiltersCard';
import FunnelsCard from './featureCards/funnelsCard';
import EventTrackingCard from './featureCards/eventTrackingCard';
import UserJourneyCard from './featureCards/userJourneyCard';
import WorldMapCard from './featureCards/worldMapCard';
import TrafficSourcesCard from './featureCards/trafficSourcesCard';

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
            <FunnelsCard />
            <EventTrackingCard />
            <UserJourneyCard />
            <WorldMapCard />
            <TrafficSourcesCard />
          </div>
        </div>

        <div className='mt-8 flex justify-center'>
          <Button variant='outline' size='lg'>
            <Link href='/docs'>Explore All Features</Link>
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </section>
  );
}
