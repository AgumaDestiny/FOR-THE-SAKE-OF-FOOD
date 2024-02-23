/*
  Warnings:

  - You are about to drop the column `foodhistoryId` on the `Foods` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Foods" DROP CONSTRAINT "Foods_foodhistoryId_fkey";

-- AlterTable
ALTER TABLE "Foods" DROP COLUMN "foodhistoryId";

-- CreateTable
CREATE TABLE "_FoodhistoryToFoods" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodhistoryToFoods_AB_unique" ON "_FoodhistoryToFoods"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodhistoryToFoods_B_index" ON "_FoodhistoryToFoods"("B");

-- AddForeignKey
ALTER TABLE "_FoodhistoryToFoods" ADD CONSTRAINT "_FoodhistoryToFoods_A_fkey" FOREIGN KEY ("A") REFERENCES "Foodhistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodhistoryToFoods" ADD CONSTRAINT "_FoodhistoryToFoods_B_fkey" FOREIGN KEY ("B") REFERENCES "Foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
