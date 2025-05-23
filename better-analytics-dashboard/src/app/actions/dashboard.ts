'use server';

import { Dashboard } from "@/entities/dashboard";
import { requireAuth } from "@/lib/auth-actions";
import { createNewDashboard } from "@/services/dashboard";

export async function createDashboardAction(domain: string): Promise<Dashboard> {
  const session = await requireAuth();
  
  return createNewDashboard(domain, session.user.id);
}