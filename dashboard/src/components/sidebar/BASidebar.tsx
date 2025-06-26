import {
  LayoutDashboard,
  FileText,
  Smartphone,
  CircleDot,
  Globe,
  Link2,
  Funnel,
  DollarSign,
  Route,
} from 'lucide-react';
import { BASidebarHeader } from './BASidebarHeader';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import SettingsButton from '../SettingsButton';
import { IntegrationButton } from '@/components/integration/IntegrationButton';
import { FilterPreservingLink } from '@/components/ui/FilterPreservingLink';
import { ActiveUsersLabel } from './ActiveUsersLabel';
import { Suspense } from 'react';

const navItems = [
  { name: 'Overview', href: '', icon: <LayoutDashboard size={18} /> },
  { name: 'Pages', href: 'pages', icon: <FileText size={18} /> },
  { name: 'Referrers', href: 'referrers', icon: <Link2 size={18} /> },
  { name: 'Geography', href: 'geography', icon: <Globe size={18} /> },
  { name: 'User Journey', href: 'user-journey', icon: <Route size={18} /> },
  { name: 'Funnels', href: 'funnels', icon: <Funnel size={18} /> },
  { name: 'Devices', href: 'devices', icon: <Smartphone size={18} /> },
  { name: 'Campaigns', href: 'campaign', icon: <DollarSign size={18} /> },
  { name: 'Events', href: 'events', icon: <CircleDot size={18} /> },
];

type BASidebarProps = {
  dashboardId: string;
};

export default async function BASidebar({ dashboardId }: BASidebarProps) {
  return (
    <Sidebar variant='floating' collapsible='icon' className='top-14 z-600 h-[calc(100vh-3.5rem)]'>
      <SidebarHeader>
        <BASidebarHeader />
      </SidebarHeader>
      <SidebarContent className='bg-background z-600 pl-1'>
        <SidebarGroup className='z-600'>
          <SidebarGroupLabel>
            <Suspense fallback={null}>
              <ActiveUsersLabel />
            </Suspense>
          </SidebarGroupLabel>
          <SidebarGroupContent className='pt-2'>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <FilterPreservingLink href={`/dashboard/${dashboardId}/${item.href}`}>
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </FilterPreservingLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className='gap-2'>
          <IntegrationButton />
          <SettingsButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
