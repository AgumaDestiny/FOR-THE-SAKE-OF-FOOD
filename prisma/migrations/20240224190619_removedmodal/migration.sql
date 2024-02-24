/*
  Warnings:

  - You are about to drop the `Modal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Mealplanner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mealplanner" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Modal";
