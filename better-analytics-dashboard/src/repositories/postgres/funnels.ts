import { CreateFunnel, FunnelSchema, Funnel } from "@/entities/funnels";
import prisma from "@/lib/postgres";

export async function getFunnelsByDashboardId(dashboardCUID: string): Promise<Funnel[]> {
  const funnels = await prisma.funnel.findMany({
    where: { dashboardId: dashboardCUID }
  });
  return funnels.map((funnel) => FunnelSchema.parse(funnel));
}

export async function getFunnelById(id: string): Promise<Funnel | null> {
  const funnel = await prisma.funnel.findUnique({
    where: { id }
  });
  if (funnel === null) {
    return null;
  }
  return FunnelSchema.parse(funnel);
}

export async function createFunnel(funnelData: CreateFunnel): Promise<Funnel> {
  const createdFunnel = await prisma.funnel.create({
    data: {
      name: funnelData.name,
      pages: funnelData.pages,
      dashboardId: funnelData.dashboardId,
    }
  });
  return FunnelSchema.parse(createdFunnel);
}

