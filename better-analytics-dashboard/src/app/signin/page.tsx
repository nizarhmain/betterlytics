import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import LoginForm from "@/components/LoginForm"
import Logo from "@/components/logo"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo variant="full" width={200} height={60} priority />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your analytics dashboard
          </p>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-sm border">
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 