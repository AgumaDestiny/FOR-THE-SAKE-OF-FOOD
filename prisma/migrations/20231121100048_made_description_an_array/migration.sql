/*
  Warnings:

  - The `description` column on the `Recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];
