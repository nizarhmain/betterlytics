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

  if (!session?.dashboardId || !session?.siteId) {
    console.error("Dashboard ID or Site ID missing from session after user authentication.");
    redirect("/auth/signin");
  }
  
  return session;
} 

export async function requireDashboardAuth() {
  const session = await requireAuth();

  if (!session.dashboardId || !session.siteId) {
    console.log("User authenticated but critical dashboard/site identifiers are missing.");
    redirect("/auth/signin");
  }
  return session as Session & { 
    user: { role?: string }, 
    dashboardId: string, 
    siteId: string 
  };
} 