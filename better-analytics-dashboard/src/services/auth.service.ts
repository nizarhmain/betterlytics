import * as bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '@/repositories/postgres/user';
import { findFirstDashboardByUserId, upsertDashboard } from '@/repositories/postgres/dashboard';
import { env } from '@/lib/env';
import type { User } from 'next-auth';
import { CreateUserData, AuthenticatedUserSchema, LoginUserData } from '@/entities/user';
import { DashboardWriteData } from '@/entities/dashboard';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

/**
 * Verifies user credentials against stored password hash
 * @returns User object or null if verification fails
 */
export async function verifyCredentials(loginData: LoginUserData): Promise<User | null> {
  const { email, password } = loginData;
  const dbUser = await findUserByEmail(email);

  if (!dbUser || !dbUser.passwordHash) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(password, dbUser.passwordHash);
  if (!passwordIsValid) {
    return null;
  }

  let dashboard = await findFirstDashboardByUserId(dbUser.id);

  if (!dashboard) {
    const siteId = uuidv4();
    
    const dashboardName = `${dbUser.name || 'User'}'s Dashboard`;
    
    const dashboardData: DashboardWriteData = {
      siteId,
      userId: dbUser.id,
      name: dashboardName
    };
    
    dashboard = await upsertDashboard(dashboardData);
    console.log(`Created new dashboard with siteId ${siteId} for user ${dbUser.email}`);
  }

  if (!dashboard) {
    console.error(`User ${dbUser.email} authenticated but has no accessible dashboard.`);
    return null;
  }

  try {
    return AuthenticatedUserSchema.parse({
      ...dbUser,
      dashboardId: dashboard.id,
      siteId: dashboard.siteId,
    });
  } catch (error) {
    console.error("Error validating authenticated user data:", error);
    return null;
  }
}

/**
 * Attempts to initialize an admin account if no users exist with admin email
 * Only proceeds when credentials match environment variables
 */
export async function attemptAdminInitialization(
  email: string, 
  password: string
): Promise<User | null> {
  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    return null;
  }

  const existingAdmin = await findUserByEmail(email);
  if (existingAdmin) {
    return null;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const adminUserData: CreateUserData = {
      email,
      name: "Admin",
      passwordHash: hashedPassword,
      role: "admin",
    };
    
    const newAdminUser = await createUser(adminUserData);
    
    const siteId = uuidv4();

    const dashboardData: DashboardWriteData = {
      siteId,
      userId: newAdminUser.id,
      name: "Default Admin Dashboard"
    };
    
    const dashboard = await upsertDashboard(dashboardData);
    
    return AuthenticatedUserSchema.parse({
      ...newAdminUser,
      dashboardId: dashboard.id,
      siteId,
    });
  } catch (error) {
    console.error("Error during initial admin setup:", error);
    return null;
  }
} 