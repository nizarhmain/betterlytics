import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <SignOutButton />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">
              Welcome, {session.user?.name || "User"}! You are logged in as an {session.user?.role || "user"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 