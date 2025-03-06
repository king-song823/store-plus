/*
  Warnings:

  - You are about to drop the column `fileList` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fileList",
ADD COLUMN     "files" JSONB[];
