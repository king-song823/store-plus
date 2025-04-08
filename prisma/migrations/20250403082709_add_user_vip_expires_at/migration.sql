/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "account_userId_user_id_fk";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentToken" TEXT,
ADD COLUMN     "vipExpiresAt" TIMESTAMP(6);

-- DropTable
DROP TABLE "Account";
