import { Lock, Zap, Database, Eye, Code, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Lock className='h-6 w-6' />,
    title: '100% GDPR Compliant',
    description:
      'No cookies, no personal data collection. Fully compliant with privacy regulations out of the box.',
  },
  {
    icon: <Zap className='h-6 w-6' />,
    title: 'Lightweight & Fast',
    description: "Under 1KB script size. Won't slow down your site or impact user experience.",
  },
  {
    icon: <Database className='h-6 w-6' />,
    title: 'Full Data Ownership',
    description: 'Your data stays yours. Self-host or use our cloud with complete control over your analytics.',
  },
  {
    icon: <Eye className='h-6 w-6' />,
    title: 'Real-time Insights',
    description:
      'Instant data updates and live visitor tracking with sub-second performance and beautiful dashboards.',
  },
  {
    icon: <Code className='h-6 w-6' />,
    title: 'Easy Integration',
    description:
      'Simple setup for any website. Advanced APIs and documentation available for custom implementations.',
  },
  {
    icon: <Globe className='h-6 w-6' />,
    title: 'Global Edge Network',
    description: 'Lightning-fast data collection from anywhere in the world with our edge infrastructure.',
  },
];

export function PrinciplesSection() {
  return (
    <section id='features' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
            <span className='dark:gradient-text'>High-performance analytics</span> that respects privacy
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Real-time insights, lightning-fast performance, and complete privacy compliance for everyone
          </p>
        </div>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <Card key={index} className='dark:metric-card dark:shadow-card-glow'>
              <CardHeader>
                <div className='text-primary mb-2'>{feature.icon}</div>
                <CardTitle className='text-xl'>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
