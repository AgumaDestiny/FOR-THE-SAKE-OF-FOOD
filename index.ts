import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import express, { Request, Response, request } from "express";
const prisma = new PrismaClient();
const app = express();
var cors = require("cors");

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/all-recipes", async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipes.findMany();
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipe data:", error);
    res.status(500).json({ error: "Error fetching recipe data" });
  }
});

app.get("/api/all-foods", async (req: Request, res: Response) => {
  try {
    const foods = await prisma.foods.findMany({
      include: {
        foodcategory: true,
      },
    });


    const foodData = foods.map((food) => ({
      label: food.name,
      value: food.id,
    }));

    return res.status(201).json(foodData);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).json({ error: "Error fetching food data" });
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
        category: "drinks",
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
        category: "dessert",
      },
    });
    res.json(dessert);
  } catch (error) {
    console.error("Error fetching dessert data:", error);
    res.status(500).json({ error: "Error fetching dessert data" });
  }
});
//api to post data to food history table
app.post("/api/foodhistory", async (req: Request, res: Response) => {
  try {
    const {
      foodName,
      mealType,
      cookingMethod,
      freshness,
      date,
      userId,
    } = req.body;
    console.log(req.body,"req.body ends here")
    // Extracting label and value from the array of objects
    const formattedFoodName = foodName.map((item: { label: string, value: number }) => item.label);
    const formattedCookingMethod = cookingMethod.map((item: { label: string, value: string }) => item.label);
    console.log(formattedCookingMethod,"cooking method")
    console.log(formattedFoodName,"foodname")
    const result = await prisma.foodhistory.create({
      data: {
        date,
        foods: { create: formattedFoodName.map((name: string) => ({ name })) },
        mealType,
        cookingMethod: formattedCookingMethod,
        freshness,
        userId :userId
      },
    });
console.log(result,"result ends here")
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
//api to get data from foodhistory table
// app.get("/api/foodhistory", async (req: Request, res: Response) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: 'Date parameter is required.' });
//     }

//     const formattedDate = new Date(date);

//     // Fetch data from foodhistory table including related foods and foodcategories
//     const foodhistoryData: Foodhistory[] = await prisma.foodhistory.findMany({
//       where: {
//         date: formattedDate,
//       },
//       include: {
//         foods: {
//           include: {
//             foodcategory: true,
//           },
//         },
//       },
//     });

//     // Organize the data as needed, for example, create a response object
//     const responseData = foodhistoryData.map((entry) => ({
//       id: entry.id,
//       date: entry.date,
//       mealType: entry.mealType,
//       cookingMethod: entry.cookingMethod,
//       freshness: entry.freshness,
//       userId: entry.userId,
//       foods: entry.foods.map((food) => ({
//         id: food.id,
//         name: food.name,
//         foodcategories: food.foodcategory.map((category) => ({
//           id: category.id,
//           name: category.name,
//         })),
//       })),
//     }));

//     return res.status(200).json(responseData);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

//api to get favorites id
app.get("/api/getfavorites/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    throw new Error("Please pass in a user Id");
  }
  try {
    const getfavorites = await prisma.favorites.findMany({
      where: {
        userId: userId,
      },
    });

    const favoriteRecipes = await prisma.recipes.findMany({
      where: {
        id: {
          in: getfavorites.map((each) => each.recipesId),
        },
      },
    });

    return res.status(201).json(favoriteRecipes);
  } catch (error) {
    console.log(error);
  }
});
//api to post data to favorites table
app.post("/api/favorites", async (req: Request, res: Response) => {
  try {
    const { recipesId, userId } = req.body;
    const result = await prisma.favorites.create({
      data: {
        userId: userId,
        recipe: {
          connect: {
            id: recipesId,
          },
        },
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
});
//api to get food and foodcategory data
app.get("/api/foods", async (req, res) => {
  let foodNames = req.query.foodName;
  console.log(foodNames);
  // Ensure foodNames is a plain string array
  // if (
  //   !Array.isArray(foodNames) ||
  //   !foodNames.every((name) => typeof name === "string")
  // ) {
  //   return res
  //     .status(400)
  //     .json({ error: "Food name must be an array of strings" });
  // }

  try {
    const foods = await prisma.foods.findMany({
      where: {
        name: { in: [] },
      },
      include: {
        foodcategory: true,
      },
    });

    // Combine and deduplicate categories
    const allCategories = foods.flatMap((food) => food.foodcategory);
    const uniqueCategories = Array.from(
      new Set(allCategories.map((cat) => cat.name))
    ).map((name) => ({ value: name, label: name })); // Maintain desired format

    res.json(uniqueCategories);
  } catch (error) {
    console.error("Error fetching food categories:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// app.delete("/api/favorites", async (req: Request, res: Response) => {
//   try {
//     const { recipesId, userId } = req.body;
//     const result = await prisma.favorites.findFirst({
//       where: {
//         AND: [{ userId: userId }, { recipesId: recipesId }],
//       },
//     });

//     const data = await prisma.favorites.delete({
//       where: {
//         id: result?.id,
//       },
//     });

//     return res.status(201).json(data);
//   } catch (error) {
//     console.log(error);
//   }
// });


// GET /groceries - Get all grocery items


app.get('/api/groceries', async (req: Request, res: Response) => {
  const groceries = await prisma.groceryItem.findMany();
  res.json(groceries);
});

// POST /groceries -  Add a new grocery item
app.post('/api/groceries', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newGroceryItem = await prisma.groceryItem.create({
      data: { name },
    });
    res.status(201).json(newGroceryItem);
  } catch (error) {
    res.status(400).json({ error: "Error fetching data"  });
  }
});

// PATCH /groceries/:id - Update checked status
app.patch('/api/groceries/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { checked } = req.body;

  try {
    const updatedGroceryItem = await prisma.groceryItem.update({
      where: { id: parseInt(id) },
      data: { checked },
    });
    res.json(updatedGroceryItem);
  } catch (error) {
    res.status(400).json({ error: "Error fetching data"  });
  }
});

// DELETE /groceries/:id - Delete an item
app.delete('/api/groceries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.groceryItem.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: "Error fetching data"  });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
