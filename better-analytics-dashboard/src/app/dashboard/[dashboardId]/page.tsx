import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"
import DashboardFilters from "../../../components/dashboard/DashboardFilters"
import { TableSkeleton, SummaryCardSkeleton, ChartSkeleton } from "@/components/skeleton"
import SummaryAndChartSection from "./SummaryAndChartSection"
import PagesAnalyticsSection from "./PagesAnalyticsSection"
import GeographySection from "./GeographySection"
import DevicesSection from "./DevicesSection"
import TrafficSourcesSection from "./TrafficSourcesSection"
import CustomEventsSection from "./CustomEventsSection"

const SummaryAndChartSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <SummaryCardSkeleton key={i} />
      ))}
    </div>
    <ChartSkeleton />
  </div>
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        <DashboardFilters />

        <Suspense fallback={<SummaryAndChartSkeleton />}>
          <SummaryAndChartSection />
        </Suspense>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<TableSkeleton />}>
            <PagesAnalyticsSection />
          </Suspense>
          <Suspense fallback={<TableSkeleton />}>
            <GeographySection />
          </Suspense>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex-1 lg:flex-[2]">
            <Suspense fallback={<TableSkeleton />}>
              <DevicesSection />
            </Suspense>
          </div>
          <div className="flex-1">
            <Suspense fallback={<TableSkeleton />}>
              <TrafficSourcesSection />
            </Suspense>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<TableSkeleton />}>
            <CustomEventsSection />
          </Suspense>
          <div>
            {/* Placeholder for future content */}
          </div>
        </div>
      </div>
    </div>
  )
} 