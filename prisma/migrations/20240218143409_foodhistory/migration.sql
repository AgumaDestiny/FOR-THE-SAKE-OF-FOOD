-- CreateTable
CREATE TABLE "Foodhistory" (
    "id" SERIAL NOT NULL,
    "foodname" TEXT NOT NULL,
    "foodcategory" TEXT[],
    "cookingmethod" TEXT[],
    "freshness" TEXT NOT NULL,
    "mealtype" TEXT NOT NULL,

    CONSTRAINT "Foodhistory_pkey" PRIMARY KEY ("id")
);
