import prisma from '@/lib/postgres';
import {
  BillingHistory,
  BillingHistorySchema,
  CreateBillingHistoryData,
  CreateBillingHistorySchema,
} from '@/entities/billing';

export async function getBillingHistoryByUserId(userId: string): Promise<BillingHistory[]> {
  try {
    const billingHistory = await prisma.billingHistory.findMany({
      where: { userId },
      orderBy: { periodStart: 'desc' },
    });

    return billingHistory.map((history) => BillingHistorySchema.parse(history));
  } catch (error) {
    console.error('Failed to get user billing history:', error);
    return [];
  }
}

export async function createBillingHistoryEntry(data: CreateBillingHistoryData): Promise<BillingHistory> {
  const validatedData = CreateBillingHistorySchema.parse(data);

  const billingHistory = await prisma.billingHistory.create({
    data: validatedData,
  });

  return BillingHistorySchema.parse(billingHistory);
}
