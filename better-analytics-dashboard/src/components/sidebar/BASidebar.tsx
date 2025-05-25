import Link from "next/link";
import { LayoutDashboard, FileText, Smartphone, CircleDot, Globe, Link2, Funnel, DollarSign, Route } from "lucide-react";
import { BASidebarHeader } from "./BASidebarHeader";
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
  SidebarMenuItem
} from "@/components/ui/sidebar";
import BASidebarCollapsibleSignOutButton from "./BASidebarCollapsibleSignOutButton";
import { IntegrationButton } from "@/components/integration/IntegrationButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  //{ name: "Realtime", href: "/dashboard/realtime", icon: <BarChart size={18} /> },
  { name: "Pages", href: "/dashboard/pages", icon: <FileText size={18} /> },
  { name: "Referrers", href: "/dashboard/referrers", icon: <Link2 size={18} /> },
  { name: "Geography", href: "/dashboard/geography", icon: <Globe size={18} /> },
  { name: "User Journey", href: "/dashboard/user-journey", icon: <Route size={18} /> },
  { name: "Funnels", href: "/dashboard/funnels", icon: <Funnel size={18} /> },
  { name: "Devices", href: "/dashboard/devices", icon: <Smartphone size={18} /> },
  { name: "Campaigns", href: "/dashboard/campaign", icon: <DollarSign size={18} /> },
  { name: "Events", href: "/dashboard/events", icon: <CircleDot size={18} /> },
];

export default function BASidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <BASidebarHeader />
      </SidebarHeader>
      <SidebarContent className="pl-1">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <ThemeSwitcher />
          <IntegrationButton />
          <BASidebarCollapsibleSignOutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 