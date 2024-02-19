/*
  Warnings:

  - The `date` column on the `Foodhistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Foodhistory" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "recipesId" INTEGER NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_recipesId_fkey" FOREIGN KEY ("recipesId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
