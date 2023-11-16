-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'image',
    "ingredients" TEXT[],

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);
