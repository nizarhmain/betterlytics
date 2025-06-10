import { Lock, Zap, Database, Eye, Code, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Lock className='h-6 w-6' />,
    title: 'EU-Based & GDPR Compliant',
    description:
      'Servers hosted in the EU with strict data protection. No cookies, no personal data collection, fully anonymous by design.',
  },
  {
    icon: <Zap className='h-6 w-6' />,
    title: 'Lightweight & Developer-Friendly',
    description:
      'Under 1KB script, open-source codebase, and comprehensive APIs. Built by developers, for developers.',
  },
  {
    icon: <Database className='h-6 w-6' />,
    title: 'Complete Data Ownership',
    description:
      'Your data stays yours forever. Self-host with our open-source version or use our secure cloud infrastructure.',
  },
  {
    icon: <Eye className='h-6 w-6' />,
    title: 'Real-time Business Insights',
    description:
      'Live visitor tracking, conversion analytics, and beautiful dashboards that help you make data-driven decisions.',
  },
  {
    icon: <Code className='h-6 w-6' />,
    title: 'Simple Setup, Powerful Features',
    description:
      'One-line integration for any website. Advanced customization options and enterprise-grade features available.',
  },
  {
    icon: <Globe className='h-6 w-6' />,
    title: 'Global Performance',
    description: 'Lightning-fast data collection worldwide with 99.9% uptime and enterprise-level reliability.',
  },
];

export function PrinciplesSection() {
  return (
    <section id='features' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
            <span className='text-blue-600 dark:text-blue-400'>High-performance</span> analytics that respects
            privacy
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
