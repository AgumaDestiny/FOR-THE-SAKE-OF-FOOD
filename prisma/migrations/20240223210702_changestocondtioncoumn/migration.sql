/*
  Warnings:

  - The `condtion` column on the `Recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "condtion",
ADD COLUMN     "condtion" TEXT[];

-- DropEnum
DROP TYPE "Condition";
