'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

async function getAuthSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireAuth(): Promise<Session> {
  const session = await getAuthSession();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!session?.dashboardId) {
    console.error("Dashboard ID missing from session after user authentication.");
    redirect("/auth/signin");
  }
  
  return session;
} 

export async function requireDashboardAuth() {
  const session = await requireAuth();

  if (!session.dashboardId) {
    console.log("User authenticated but no active dashboard ID found in session, redirecting.");
    redirect("/auth/signin");
  }
  return session as Session & { user: { role?: string }, dashboardId: string };
} 