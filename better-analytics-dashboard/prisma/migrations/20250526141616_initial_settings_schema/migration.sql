-- CreateTable
CREATE TABLE "DashboardSettings" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "showGridLines" BOOLEAN NOT NULL DEFAULT true,
    "defaultDateRange" TEXT NOT NULL DEFAULT '7d',
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "weeklyReports" BOOLEAN NOT NULL DEFAULT true,
    "monthlyReports" BOOLEAN NOT NULL DEFAULT false,
    "reportRecipients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "alertsThreshold" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSettings_dashboardId_key" ON "DashboardSettings"("dashboardId");

-- AddForeignKey
ALTER TABLE "DashboardSettings" ADD CONSTRAINT "DashboardSettings_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
