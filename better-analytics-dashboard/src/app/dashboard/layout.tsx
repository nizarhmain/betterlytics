import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { DashboardProvider } from "./DashboardProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1">
          <Topbar />
          <div className="p-4">{children}</div>
        </main>
      </div>
    </DashboardProvider>
  );
} 