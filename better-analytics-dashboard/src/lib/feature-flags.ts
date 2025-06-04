import { env } from './env';

/**
 * Feature flags for controlling application behavior in different environments
 */
export const featureFlags = {
  enableDashboardTracking: env.ENABLE_DASHBOARD_TRACKING,
} as const;

export function isFeatureEnabled(flag: keyof typeof featureFlags): boolean {
  return featureFlags[flag];
}
