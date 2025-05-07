import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DevicesClient from "@/app/dashboard/devices/DevicesClient";

export default async function DevicesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <DevicesClient />;
} 