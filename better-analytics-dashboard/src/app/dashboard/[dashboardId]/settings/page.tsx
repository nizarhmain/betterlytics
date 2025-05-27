import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SettingsPageClient from "./SettingsPageClient";

type SettingsPageProps = {
  params: Promise<{ dashboardId: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const { dashboardId } = await params;

  return <SettingsPageClient dashboardId={dashboardId} />;
} 