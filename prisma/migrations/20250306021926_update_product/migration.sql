/*
  Warnings:

  - You are about to drop the column `files` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "files",
ADD COLUMN     "fileList" JSONB[];
