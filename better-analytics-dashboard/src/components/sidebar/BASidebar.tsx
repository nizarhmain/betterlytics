import Link from "next/link";
import { LayoutDashboard, FileText, Smartphone, CircleDot, Globe, Link2, Funnel, DollarSign } from "lucide-react";
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
import SettingsButton from "../SettingsButton";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  //{ name: "Realtime", href: "/dashboard/realtime", icon: <BarChart size={18} /> },
  { name: "Pages", href: "/dashboard/pages", icon: <FileText size={18} /> },
  { name: "Referrers", href: "/dashboard/referrers", icon: <Link2 size={18} /> },
  //{ name: "Geography", href: "/dashboard/geography", icon: <Globe size={18} /> },
  //{ name: "Referrers", href: "/dashboard/referrers", icon: <Link2 size={18} /> },
  { name: "Geography", href: "/dashboard/geography", icon: <Globe size={18} /> },
  { name: "User Journey", href: "/dashboard/user-journey", icon: <CircleDot size={18} /> },
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
          <div className="pt-4 mt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Configuration</div>
            <SettingsButton />
          </div>
          <BASidebarCollapsibleSignOutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 