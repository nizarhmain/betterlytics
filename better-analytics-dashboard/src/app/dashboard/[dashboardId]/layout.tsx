import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import BASidebar from '@/components/sidebar/BASidebar';
import { DashboardProvider } from './DashboardProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import BAMobileSidebarTrigger from '@/components/sidebar/BAMobileSidebarTrigger';
import { TrackingScript } from './TrackingScript';
import { fetchSiteId } from '@/app/actions';
import { isFeatureEnabled } from '@/lib/feature-flags';

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

  const shouldEnableTracking = isFeatureEnabled('enableDashboardTracking');
  let siteId: string | null = null;

  if (shouldEnableTracking) {
    try {
      siteId = await fetchSiteId(dashboardId);
    } catch (error) {
      console.error('Failed to fetch site ID for tracking:', error);
    }
  }

  return (
    <DashboardProvider>
      <SidebarProvider>
        <BASidebar dashboardId={dashboardId} />
        <BAMobileSidebarTrigger />
        <div className='bg-background flex min-h-screen w-full'>
          <main className='flex flex-1 flex-col'>
            <div className='flex-1'>{children}</div>
          </main>
        </div>
        {/* Conditionally render tracking script based on server-side feature flag */}
        {shouldEnableTracking && siteId && <TrackingScript siteId={siteId} />}
      </SidebarProvider>
    </DashboardProvider>
  );
}
