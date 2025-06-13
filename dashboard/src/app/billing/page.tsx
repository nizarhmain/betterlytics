'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PricingComponent } from '@/components/pricing/PricingComponent';

const FAQ_ITEMS = [
  {
    question: 'Can I change my plan anytime?',
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.",
  },
  {
    question: 'What happens if I exceed my event limit?',
    answer:
      "We'll continue tracking your events, but you'll only be able to view data up to the date when you exceeded your limit. Upgrade your plan to access all your data again.",
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Currently we offer monthly billing only. Annual billing with discounts is coming soon!',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Our Starter plan includes 10,000 free events per month forever. No credit card required to get started.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Absolutely. You can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express) and support secure payments through our payment processor.',
  },
];

export default function BillingPage() {
  const handlePlanSelect = (planName: string, planData: any) => {
    // TODO: Integrate with some payment service - perhaps external Stripe or Mollie?
    console.log('Proceeding to checkout with:', planData);
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/50 border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                href='/dashboard'
                className='text-muted-foreground hover:text-foreground flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Dashboard
              </Link>
              <div className='bg-border h-4 w-px' />
              <h1 className='text-xl font-semibold'>Choose Your Plan</h1>
            </div>{' '}
          </div>
        </div>
      </div>

      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='mb-16 space-y-4 text-center'>
          <h2 className='text-3xl font-bold sm:text-4xl'>Upgrade your plan</h2>
          <p className='text-muted-foreground text-xl'>Choose the perfect plan for your analytics needs.</p>
        </div>

        <PricingComponent onPlanSelect={handlePlanSelect} />

        <div className='mt-6 text-center'>
          <p className='text-muted-foreground text-sm'>Start with our free plan - no credit card required.</p>
        </div>

        <div className='mx-auto mt-20 max-w-5xl'>
          <div className='mb-12 text-center'>
            <h3 className='mb-4 text-2xl font-bold'>Frequently Asked Questions</h3>
            <p className='text-muted-foreground'>Everything you need to know about our pricing and plans</p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className='space-y-3'>
                <h4 className='text-base font-semibold'>{item.question}</h4>
                <p className='text-muted-foreground text-sm leading-relaxed'>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
