/*
  Warnings:

  - You are about to drop the column `cookingmethod` on the `Foodhistory` table. All the data in the column will be lost.
  - You are about to drop the column `foodcategory` on the `Foodhistory` table. All the data in the column will be lost.
  - You are about to drop the column `foodname` on the `Foodhistory` table. All the data in the column will be lost.
  - You are about to drop the column `mealtype` on the `Foodhistory` table. All the data in the column will be lost.
  - Added the required column `foodName` to the `Foodhistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealType` to the `Foodhistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Foodhistory" DROP COLUMN "cookingmethod",
DROP COLUMN "foodcategory",
DROP COLUMN "foodname",
DROP COLUMN "mealtype",
ADD COLUMN     "cookingMethod" TEXT[],
ADD COLUMN     "foodCategory" TEXT[],
ADD COLUMN     "foodName" TEXT NOT NULL,
ADD COLUMN     "mealType" TEXT NOT NULL;
