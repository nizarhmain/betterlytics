import { redirect } from "next/navigation";
import { getAuthSession } from "@/auth/auth-actions";
import { getFirstUserDashboard } from "../../actions";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/");
  }

  const dashboard = await getFirstUserDashboard();

  if (dashboard === null) {
    redirect(`/create`);
  }

  redirect(`/dashboard/${dashboard.id}`);
}
