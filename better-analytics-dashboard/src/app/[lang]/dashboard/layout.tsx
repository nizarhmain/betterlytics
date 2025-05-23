import { Toaster } from "@/components/ui/sonner"
import BASidebar from "@/components/sidebar/BASidebar";
import { DashboardProvider } from "./DashboardProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BAMobileSidebarTrigger from "@/components/sidebar/BAMobileSidebarTrigger";
import { SupportedLanguages } from "../dictionaries";

export default async function DashboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{lang: SupportedLanguages}> }) {

  return (
    <DashboardProvider>
      <SidebarProvider>
        <BASidebar params={params}/>
        <BAMobileSidebarTrigger />
        <div className="flex min-h-screen bg-background w-full">
          <main className="flex-1 flex flex-col">
            <div className="flex-1">{children}</div>
          </main>
          <Toaster />
        </div>
      </SidebarProvider>
    </DashboardProvider>
  );
} 