import BATopbar from '@/components/topbar/BATopbar';
import { type ReactNode } from 'react';

type DashboardsLayoutProps = {
  children: ReactNode;
};

export default function DashboardsLayout({ children }: DashboardsLayoutProps) {
  return (
    <section className='h-full w-full'>
      <BATopbar />
      {children}
    </section>
  );
}
