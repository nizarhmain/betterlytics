import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardPageClient from "./DashboardPageClient"

type DashboardPageProps = {
  params: Promise<{ dashboardId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const { dashboardId } = await params;

  return <DashboardPageClient dashboardId={dashboardId} />
} 