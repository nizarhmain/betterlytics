'use client';

import { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const eventRanges = [
  { value: 10000, label: '10K', price: 0 },
  { value: 50000, label: '50K', price: 6 },
  { value: 100000, label: '100K', price: 13 },
  { value: 150000, label: '150K', price: 20 },
  { value: 200000, label: '200K', price: 27 },
  { value: 500000, label: '500K', price: 48 },
  { value: 1000000, label: '1M', price: 69 },
  { value: 2000000, label: '2M', price: 132 },
  { value: 5000000, label: '5M', price: 209 },
  { value: 10000000, label: '10M', price: 349 },
  { value: 25000000, label: '10M+', price: 'Custom' },
];

export function PricingSection() {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);
  const currentRange = eventRanges[selectedRangeIndex];
  const isFree = currentRange.price === 0;
  const isCustom = currentRange.price === 'Custom';

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSelectedRangeIndex(index);
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: isFree ? 'Free' : isCustom ? 'Custom' : `$${currentRange.price}`,
      period: !isFree && !isCustom ? '/month' : '',
      description: 'Perfect for small websites and personal projects',
      features: [
        `Up to ${currentRange.label} events/month`,
        'Real-time dashboard',
        'All analytics features',
        '1 website',
        '1 year data retention',
        'Email support',
      ],
      cta: isFree ? 'Get Started Free' : isCustom ? 'Contact Sales' : 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: isFree ? '$6' : isCustom ? 'Custom' : `$${Math.round((currentRange.price as number) * 2)}`,
      period: !isCustom ? '/month' : '',
      description: 'Advanced features for growing businesses',
      features: [
        `Up to ${currentRange.label} events/month`,
        'Everything in Starter',
        '3+ years data retention',
        'Up to 50 sites',
        //'Access to API',
        'Up to 10 team members',
        'Priority support',
      ],
      cta: isCustom ? 'Contact Sales' : 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Complete solution for large organizations',
      features: [
        'Everything in Professional',
        '5+ years data retention',
        'Unlimited sites',
        'Unlimited team members',
        'Dedicated support & help',
        'SLA guarantee',
      ],
      cta: 'Contact Us',
      popular: false,
    },
  ];

  return (
    <section id='pricing' className='bg-card/20 py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
            <span className='text-blue-600 dark:text-blue-400'>Simple, scalable</span> pricing
          </h2>
          <p className='text-muted-foreground text-xl'>
            Traffic-based plans that matches your growth. Start free, scale as you grow.
          </p>
        </div>

        <EventSlider
          currentRange={currentRange}
          selectedRangeIndex={selectedRangeIndex}
          handleSliderChange={handleSliderChange}
        />

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`dark:metric-card relative flex flex-col ${plan.popular ? 'dark:shadow-card-glow border-primary/50' : ''}`}
            >
              {plan.popular && (
                <Badge className='bg-primary absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                  Most Popular
                </Badge>
              )}
              <CardHeader className='text-center'>
                <CardTitle className='text-2xl'>{plan.name}</CardTitle>
                <div className='mt-4'>
                  <span className='text-4xl font-bold'>{plan.price}</span>
                  {plan.period && <span className='text-muted-foreground text-lg'>{plan.period}</span>}
                </div>
                <CardDescription className='mt-2'>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-grow flex-col'>
                <ul className='mb-6 flex-grow space-y-3'>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center'>
                      <Check className='text-primary mr-3 h-4 w-4 flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className='mt-auto w-full' variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta.toLowerCase().includes('get started') ? (
                    <Link href='/register'>{plan.cta}</Link>
                  ) : (
                    <Link href='/contact'>{plan.cta}</Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='mt-6 text-center'>
          <p className='text-muted-foreground text-sm'>Start with our free plan - no credit card required.</p>
        </div>
      </div>
    </section>
  );
}

export function EventSlider({
  currentRange,
  selectedRangeIndex,
  handleSliderChange,
}: {
  currentRange: any;
  selectedRangeIndex: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='mx-auto mb-12 max-w-lg'>
      <div className='mb-4 text-center'>
        <div className='text-muted-foreground mb-2 text-sm'>Monthly Events</div>
        <div className='text-3xl font-bold'>{currentRange.label}</div>
      </div>

      <div className='relative'>
        <input
          type='range'
          value={selectedRangeIndex}
          onChange={handleSliderChange}
          max={eventRanges.length - 1}
          min={0}
          step={1}
          className='slider h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700'
        />

        <div className='mt-3 flex justify-between'>
          {eventRanges.map((range, index) => (
            <div
              key={index}
              className={`text-xs transition-colors ${
                index === selectedRangeIndex ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
