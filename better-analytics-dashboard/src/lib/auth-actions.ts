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
  
  return session;
} 

export async function requireDashboardAuth() {
  const session = await requireAuth();
  
  return session;
} 