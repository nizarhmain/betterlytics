import Link from "next/link";
import { LayoutDashboard, FileText, Smartphone, CircleDot, Globe, Link2, Funnel, DollarSign } from "lucide-react";
import { BASidebarHeader } from "@/components/sidebar/BASidebarHeader";
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
import BASidebarCollapsibleSignOutButton from "@/components/sidebar/BASidebarCollapsibleSignOutButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSelect } from "@/components/sidebar/LanguageSelect";
import { SupportedLanguages } from "@/app/[lang]/dictionaries";

export default async function BASidebar({ params }: { params: Promise<{lang: SupportedLanguages}> }) {
  const { lang } = await params;

  const navItems = [
    { name: "Overview", href: `/${lang}/dashboard`, icon: <LayoutDashboard size={18} /> },
    { name: "Pages", href: `/${lang}/dashboard/pages`, icon: <FileText size={18} /> },
    { name: "Referrers", href: `/${lang}/dashboard/referrers`, icon: <Link2 size={18} /> },
    { name: "Geography", href: `/${lang}/dashboard/geography`, icon: <Globe size={18} /> },
    { name: "User Journey", href: `/${lang}/dashboard/user-journey`, icon: <CircleDot size={18} /> },
    { name: "Funnels", href: `/${lang}/dashboard/funnels`, icon: <Funnel size={18} /> },
    { name: "Devices", href: `/${lang}/dashboard/devices`, icon: <Smartphone size={18} /> },
    { name: "Campaigns", href: `/${lang}/dashboard/campaign`, icon: <DollarSign size={18} /> },
    { name: "Events", href: `/${lang}/dashboard/events`, icon: <CircleDot size={18} /> },
  ];

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
          <ThemeSwitcher className="mb-4 mx-auto"/>
          <LanguageSelect className="mb-4 mx-auto" /> 
          <BASidebarCollapsibleSignOutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 