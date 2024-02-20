-- CreateTable
CREATE TABLE "Foods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodcategoryToFoods" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodcategoryToFoods_AB_unique" ON "_FoodcategoryToFoods"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodcategoryToFoods_B_index" ON "_FoodcategoryToFoods"("B");

-- AddForeignKey
ALTER TABLE "_FoodcategoryToFoods" ADD CONSTRAINT "_FoodcategoryToFoods_A_fkey" FOREIGN KEY ("A") REFERENCES "Foodcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodcategoryToFoods" ADD CONSTRAINT "_FoodcategoryToFoods_B_fkey" FOREIGN KEY ("B") REFERENCES "Foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
