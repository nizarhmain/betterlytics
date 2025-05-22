import { CreateFunnel, Funnel, FunnelSchema } from "@/entities/funnels";
import prisma from "@/lib/postgres";

export async function getFunnelsBySiteId(siteId: string) {

  const funnels = await prisma.funnel.findMany({
    where: { siteId }
  });

  return funnels.map((funnel: Funnel) => FunnelSchema.parse(funnel));
}

export async function getFunnelById(id: string) {

  const funnel = await prisma.funnel.findUnique({
    where: { id }
  });

  if (funnel === null) {
    return null;
  }

  return FunnelSchema.parse(funnel);
}

export async function createFunnel(funnel: CreateFunnel) {

  const createdFunnel = await prisma.funnel.create({
    data: {
      name: funnel.name,
      pages: funnel.pages,
      siteId: funnel.siteId,
      isStrict: funnel.isStrict
    }
  });

  return FunnelSchema.parse(createdFunnel);
}

