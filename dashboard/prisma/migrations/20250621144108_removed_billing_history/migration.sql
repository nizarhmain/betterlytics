/*
  Warnings:

  - You are about to drop the `BillingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingHistory" DROP CONSTRAINT "BillingHistory_userId_fkey";

-- DropTable
DROP TABLE "BillingHistory";
