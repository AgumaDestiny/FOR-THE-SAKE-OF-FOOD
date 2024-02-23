-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('diabetes', 'highbloodpressure', 'highcholesterollevels', 'general');

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "condtion" "Condition" NOT NULL DEFAULT 'general';

-- CreateTable
CREATE TABLE "Modal" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "BMI" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Modal_pkey" PRIMARY KEY ("id")
);
