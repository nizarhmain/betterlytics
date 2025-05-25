import prisma from "@/lib/postgres";
import {
  Dashboard,
  DashboardFindByUserData,
  DashboardFindByUserSchema,
  DashboardSchema,
  DashboardUser,
  DashboardUserSchema,
  DashboardWriteData,
  DashboardWriteSchema,
} from "@/entities/dashboard";

export async function findDashboardById(
  dashboardId: string
): Promise<Dashboard> {
  try {
    const prismaDashboard = await prisma.dashboard.findFirst({
      where: { id: dashboardId },
    });

    return DashboardSchema.parse(prismaDashboard);
  } catch {
    console.error("Error while finding dashboard relation");
    throw new Error("Failed to find user dashboard");
  }
}

export async function findUserDashboard(
  data: DashboardFindByUserData
): Promise<DashboardUser> {
  try {
    const validatedData = DashboardFindByUserSchema.parse(data);

    const prismaUserDashboard = await prisma.userDashboard.findFirst({
      where: {
        dashboardId: validatedData.dashboardId,
        userId: validatedData.userId,
      },
    });

    return DashboardUserSchema.parse(prismaUserDashboard);
  } catch {
    console.error("Error while finding dashboard relation");
    throw new Error("Failed to find user dashboard");
  }
}

export async function createDashboard(
  data: DashboardWriteData
): Promise<Dashboard> {
  try {
    const validatedData = DashboardWriteSchema.parse(data);
    console.log(validatedData);
    const prismaDashboard = await prisma.dashboard.create({
      data: {
        domain: validatedData.domain,
        siteId: validatedData.siteId,
        userAccess: {
          create: {
            userId: validatedData.userId,
            role: "admin",
          },
        },
      },
    });

    return DashboardSchema.parse(prismaDashboard);
  } catch (error) {
    console.error("Error creating dashboard:", error);
    throw new Error("Failed to create dashboard.");
  }
}
