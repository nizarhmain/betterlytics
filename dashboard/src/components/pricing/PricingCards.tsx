'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SelectedPlan, Tier } from '@/types/pricing';

interface PricingCardsProps {
  eventLimit: number;
  eventLabel: string;
  basePrice: number | 'Custom';
  onPlanSelect?: (planData: SelectedPlan) => void;
  mode?: 'landing' | 'billing';
  className?: string;
}

interface PlanConfig {
  tier: Tier;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  cta: string;
  popular: boolean;
}

export function PricingCards({
  eventLimit,
  eventLabel,
  basePrice,
  onPlanSelect,
  mode = 'landing',
  className = '',
}: PricingCardsProps) {
  const isFree = basePrice === 0;
  const isCustom = basePrice === 'Custom';

  const plans: PlanConfig[] = [
    {
      tier: 'starter',
      price: isFree ? 'Free' : isCustom ? 'Custom' : `$${basePrice}`,
      period: !isFree && !isCustom ? '/month' : '',
      description: 'Perfect for small websites and personal projects',
      features: [
        `Up to ${eventLabel} events/month`,
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
      tier: 'professional',
      price: isFree ? '$6' : isCustom ? 'Custom' : `$${Math.round((basePrice as number) * 2)}`,
      period: !isCustom ? '/month' : '',
      description: 'Advanced features for growing businesses',
      features: [
        `Up to ${eventLabel} events/month`,
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
      tier: 'enterprise',
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

  const handlePlanClick = (plan: PlanConfig) => {
    if (mode === 'billing' && onPlanSelect) {
      // Only pass essential payment data
      const selectedPlan: SelectedPlan = {
        tier: plan.tier,
        eventLimit,
        price: plan.price,
        period: plan.period,
      };
      onPlanSelect(selectedPlan);
    }
  };

  const renderButton = (plan: PlanConfig) => {
    if (mode === 'billing') {
      const isFreePlanOnBilling = plan.tier === 'starter' && isFree;

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
          key={plan.tier}
          className={`dark:metric-card relative flex flex-col ${plan.popular ? 'dark:shadow-card-glow border-primary/50' : ''}`}
        >
          {plan.popular && (
            <Badge className='bg-primary absolute -top-3 left-1/2 -translate-x-1/2 transform'>Most Popular</Badge>
          )}
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>{getTierDisplayName(plan.tier)}</CardTitle>
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

function getTierDisplayName(tier: Tier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
