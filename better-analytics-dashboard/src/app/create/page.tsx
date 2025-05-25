import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import CreateDashboardForm from "./CreateDashboardForm";

export default async function CreateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-muted rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Better Analytics
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create dashboard
          </p>
        </div>
        <CreateDashboardForm />
      </div>
    </div>
  );
}
