-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "eventLimit" INTEGER NOT NULL,
    "pricePerMonth" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "quotaExceededDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "paymentCustomerId" TEXT,
    "paymentSubscriptionId" TEXT,
    "paymentPriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_currentPeriodStart_currentPeriodEnd_idx" ON "Subscription"("currentPeriodStart", "currentPeriodEnd");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
