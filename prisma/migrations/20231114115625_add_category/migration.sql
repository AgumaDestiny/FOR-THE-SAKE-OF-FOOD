-- CreateEnum
CREATE TYPE "Category" AS ENUM ('food', 'dessert', 'drinks');

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'food';
