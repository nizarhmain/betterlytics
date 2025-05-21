import prisma from "@/lib/postgres";
import { 
  Dashboard,
  DashboardSchema, 
  DashboardWriteData,
  DashboardWriteSchema
} from "@/entities/dashboard";

export async function findFirstDashboardByUserId(userId: string): Promise<Dashboard | null> {
  try {
    const prismaDashboard = await prisma.dashboard.findFirst({
      where: { userId },
      orderBy: { id: 'asc' },
    });
    
    if (!prismaDashboard) return null;
    
    return DashboardSchema.parse(prismaDashboard);
  } catch (error) {
    console.error(`Error finding first dashboard for userId ${userId}:`, error);
    throw new Error(`Failed to find first dashboard for userId ${userId}.`);
  }
}

export async function upsertDashboard(data: DashboardWriteData): Promise<Dashboard> {
  try {
    const validatedData = DashboardWriteSchema.parse(data);
    
    const prismaDashboard = await prisma.dashboard.upsert({
      where: { siteId: validatedData.siteId },
      update: { 
        userId: validatedData.userId, 
        name: validatedData.name 
      },
      create: validatedData,
    });
    
    return DashboardSchema.parse(prismaDashboard);
  } catch (error) {
    console.error("Error upserting dashboard:", error);
    throw new Error("Failed to upsert dashboard.");
  }
} 