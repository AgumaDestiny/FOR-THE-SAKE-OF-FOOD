/*
  Warnings:

  - The `foodName` column on the `Foodhistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Foodhistory" DROP COLUMN "foodName",
ADD COLUMN     "foodName" TEXT[];
