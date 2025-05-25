import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import LoginForm from "@/components/LoginForm"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Better Analytics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
