import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ReferrersClient from "./ReferrersClient";

export default async function ReferrersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  
  return <ReferrersClient />;
} 