import { Toaster } from "@/components/ui/sonner"
import BASidebar from "@/components/sidebar/BASidebar";
import { DashboardProvider } from "./DashboardProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BAMobileSidebarTrigger from "@/components/sidebar/BAMobileSidebarTrigger";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <BASidebar />
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