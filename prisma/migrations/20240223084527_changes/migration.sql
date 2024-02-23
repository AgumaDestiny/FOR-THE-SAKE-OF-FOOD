/*
  Warnings:

  - You are about to drop the column `foodCategory` on the `Foodhistory` table. All the data in the column will be lost.
  - You are about to drop the column `foodName` on the `Foodhistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Foodhistory" DROP COLUMN "foodCategory",
DROP COLUMN "foodName";

-- AlterTable
ALTER TABLE "Foods" ADD COLUMN     "foodhistoryId" INTEGER;

-- CreateTable
CREATE TABLE "Mealplanner" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mealplanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroceryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Foods" ADD CONSTRAINT "Foods_foodhistoryId_fkey" FOREIGN KEY ("foodhistoryId") REFERENCES "Foodhistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
