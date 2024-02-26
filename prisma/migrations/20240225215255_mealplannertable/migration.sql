/*
  Warnings:

  - You are about to drop the `Breakfast` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lunch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supper` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meal` to the `Mealplanner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Meal" AS ENUM ('breakfast', 'lunch', 'supper');

-- AlterTable
ALTER TABLE "Mealplanner" ADD COLUMN     "checked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meal" "Meal" NOT NULL;

-- DropTable
DROP TABLE "Breakfast";

-- DropTable
DROP TABLE "Lunch";

-- DropTable
DROP TABLE "Supper";
