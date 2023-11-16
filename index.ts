import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const prisma = new PrismaClient();
const app = express();
var cors = require('cors')

const port = process.env.PORT || 5000;

app.use(cors({
  origin: "*"
}))

app.get("/api/all-recipes", async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipes.findMany();
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipe data:", error);
    res.status(500).json({ error: "Error fetching recipe data" });
  }
});

app.get("/api/get-recipe/:id", async (req: Request, res: Response) => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipe = await prisma.recipes.findUnique({
      where: {
        id: recipeId,
      },
    });
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe data:", error);
    res.status(500).json({ error: "Error fetching recipe data" });
  }
});
app.get("/api/food", async (req: Request, res: Response) => {
  try {
    const food = await prisma.recipes.findMany({
      where: {
        category: "food",
      },
    });
    res.json(food);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).json({ error: "Error fetching food data" });
  }
});
app.get("/api/drinks", async (req: Request, res: Response) => {
  try {
    const drinks = await prisma.recipes.findMany({
      where: {
        category:"drinks",
      },
    });
    res.json(drinks);
  } catch (error) {
    console.error("Error fetching drinks data:", error);
    res.status(500).json({ error: "Error fetching drinks data" });
  }
});
app.get("/api/dessert", async (req: Request, res: Response) => {
  try {
    const dessert = await prisma.recipes.findMany({
      where: {
        category:"dessert",
      },
    });
    res.json(dessert);
  } catch (error) {
    console.error("Error fetching dessert data:", error);
    res.status(500).json({ error: "Error fetching dessert data" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
