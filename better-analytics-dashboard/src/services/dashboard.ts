'server-only';

import { Dashboard } from '@/entities/dashboard';
import { createDashboard } from '@/repositories/postgres/dashboard';
import { generateSiteId } from '@/lib/site-id-generator';

export async function createNewDashboard(domain: string, userId: string): Promise<Dashboard> {
  const siteId = generateSiteId(domain);
  const dashboardData = {
    domain,
    userId,
    siteId
  };
  return createDashboard(dashboardData);
}