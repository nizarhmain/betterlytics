import { ArrowRight, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className='relative py-20 sm:py-32'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <Badge variant='secondary' className='mb-4'>
            <Star className='mr-1 h-3 w-3' />
            Open Source • GDPR Compliant • Cookieless
          </Badge>
          <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'>
            {/* TODO: Primary looks too dark IMO. Change to primary ? */}
            <span className='text-blue-600 dark:text-blue-400'>Privacy-First</span> <br />
            Web Analytics
          </h1>
          <p className='text-muted-foreground mx-auto mb-8 max-w-3xl text-xl'>
            Get powerful insights without compromising your users' privacy. GDPR-compliant, cookieless analytics
            that respects user privacy while delivering the data you need.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button size='lg' className='bg-primary px-8 text-lg'>
              Get Started Free
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
            <Button variant='outline' size='lg' className='px-8 text-lg'>
              <Github className='mr-2 h-5 w-5' />
              View on GitHub
            </Button>
          </div>
          <div className='text-muted-foreground mt-8 flex items-center justify-center text-sm'>
            <div className='flex items-center'>
              <Star className='mr-1 h-4 w-4 text-yellow-500' />
              <span className='font-medium'>10</span>
              <span className='ml-1'>stars on GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
