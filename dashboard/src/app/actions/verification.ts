"use server";

import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";
import { checkTrackingDataExists } from "@/services/verification";

export const verifyTrackingInstallation = withDashboardAuthContext(
  async (ctx: AuthContext): Promise<boolean> => {
    const { siteId } = ctx;
    
    try {
      return await checkTrackingDataExists(siteId);
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  }
); 