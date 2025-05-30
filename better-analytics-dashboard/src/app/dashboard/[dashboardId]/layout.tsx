import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import BASidebar from '@/components/sidebar/BASidebar';
import { DashboardProvider } from './DashboardProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import BAMobileSidebarTrigger from '@/components/sidebar/BAMobileSidebarTrigger';

type DashboardLayoutProps = {
  params: Promise<{ dashboardId: string }>;
  children: React.ReactNode;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { dashboardId } = await params;

  return (
    <DashboardProvider>
      <SidebarProvider>
        <BASidebar dashboardId={dashboardId} />
        <BAMobileSidebarTrigger />
        <main className='bg-background w-full max-w-svw overflow-x-hidden'>{children}</main>
      </SidebarProvider>
    </DashboardProvider>
  );
}
