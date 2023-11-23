/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "timestamp",
ADD COLUMN     "cooktime" TEXT NOT NULL DEFAULT 'cooktime';
