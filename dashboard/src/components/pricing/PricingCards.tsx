'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PricingCardsProps {
  currentRange: any;
  onPlanSelect?: (planName: string, planData: any) => void;
  mode?: 'landing' | 'billing';
  className?: string;
}

export function PricingCards({ currentRange, onPlanSelect, mode = 'landing', className = '' }: PricingCardsProps) {
  const isFree = currentRange.price === 0;
  const isCustom = currentRange.price === 'Custom';

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
      cta: isFree ? 'Get Started for Free' : isCustom ? 'Contact Sales' : 'Get Started',
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

  const handlePlanClick = (plan: any) => {
    if (mode === 'billing' && onPlanSelect) {
      onPlanSelect(plan.name, {
        ...plan,
        eventLimit: currentRange.value,
        eventLabel: currentRange.label,
      });
    }
  };

  const renderButton = (plan: any) => {
    if (mode === 'billing') {
      const isFreePlanOnBilling = plan.name === 'Starter' && isFree;

      return (
        <Button
          className='mt-auto w-full'
          variant={plan.popular ? 'default' : 'outline'}
          onClick={() => handlePlanClick(plan)}
          disabled={isFreePlanOnBilling}
        >
          {plan.cta}
        </Button>
      );
    }

    // Landing page mode - use Links for SEO
    return (
      <Button className='mt-auto w-full' variant={plan.popular ? 'default' : 'outline'}>
        {plan.cta.toLowerCase().includes('get started') ? (
          <Link href='/register'>{plan.cta}</Link>
        ) : (
          <Link href='/contact'>{plan.cta}</Link>
        )}
      </Button>
    );
  };

  return (
    <div className={`mx-auto grid max-w-6xl gap-8 md:grid-cols-3 ${className}`}>
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`dark:metric-card relative flex flex-col ${plan.popular ? 'dark:shadow-card-glow border-primary/50' : ''}`}
        >
          {plan.popular && (
            <Badge className='bg-primary absolute -top-3 left-1/2 -translate-x-1/2 transform'>Most Popular</Badge>
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
              {plan.features.map((feature) => (
                <li key={feature} className='flex items-center'>
                  <Check className='text-primary mr-3 h-4 w-4 flex-shrink-0' />
                  <span className='text-sm'>{feature}</span>
                </li>
              ))}
            </ul>
            {renderButton(plan)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
