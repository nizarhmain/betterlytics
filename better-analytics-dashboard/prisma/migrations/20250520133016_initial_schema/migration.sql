-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funnel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pages" TEXT[],
    "dashboardId" TEXT NOT NULL,

    CONSTRAINT "Funnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_siteId_key" ON "Dashboard"("siteId");

-- AddForeignKey
ALTER TABLE "Funnel" ADD CONSTRAINT "Funnel_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
