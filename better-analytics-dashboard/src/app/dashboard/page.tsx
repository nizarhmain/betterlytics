import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import SignOutButton from "@/components/SignOutButton"
import SummaryCard from "@/components/SummaryCard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Unique Visitors"
            value="24,589"
            changeText="↑ 12.5% vs. previous period"
            changeColor="text-green-600"
          />
          <SummaryCard
            title="Total Pageviews"
            value="78,245"
            changeText="↓ 2.3% vs. previous period"
            changeColor="text-red-600"
          />
          <SummaryCard
            title="Bounce Rate"
            value="42.3%"
            changeText="↓ 5.1% vs. previous period"
            changeColor="text-green-600"
          />
          <SummaryCard
            title="Avg. Visit Duration"
            value="2m 13s"
            changeText="↑ 8.7% vs. previous period"
            changeColor="text-green-600"
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">
            Welcome, {session.user?.name || "User"}! You are logged in as an {session.user?.role || "user"}.
          </p>
        </div>
      </div>
    </div>
  )
} 