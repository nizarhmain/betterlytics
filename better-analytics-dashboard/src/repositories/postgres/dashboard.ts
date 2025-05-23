import prisma from "@/lib/postgres";
import { 
  Dashboard,
  DashboardSchema, 
  DashboardWriteData,
  DashboardWriteSchema
} from "@/entities/dashboard";

// export async function findFirstDashboardByUserId(userId: string): Promise<Dashboard | null> {
//   try {
//     const prismaDashboard = await prisma.dashboard.findFirst({
//       where: { userId },
//       orderBy: { id: 'asc' },
//     });
    
//     if (!prismaDashboard) return null;
    
//     return DashboardSchema.parse(prismaDashboard);
//   } catch (error) {
//     console.error(`Error finding first dashboard for userId ${userId}:`, error);
//     throw new Error(`Failed to find first dashboard for userId ${userId}.`);
//   }
// }

export async function createDashboard(data: DashboardWriteData): Promise<Dashboard> {
  try {
    const validatedData = DashboardWriteSchema.parse(data);

    const prismaDashboard = await prisma.dashboard.create({
      data: {
        domain: validatedData.domain,
        siteId: validatedData.siteId,
        userAccess: {
          create: {
            userId: validatedData.userId,
            role: 'admin',
          }
        }
      }
    });
    
    return DashboardSchema.parse(prismaDashboard);
  } catch (error) {
    console.error("Error creating dashboard:", error);
    throw new Error("Failed to create dashboard.");
  }
} 