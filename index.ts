import { Foodhistory, PrismaClient } from "@prisma/client";
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
type FoodHistoryInclude = {
  foods: {
    select: {
      cookingMethod: true;
    };
  };
};
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
app.get("/api/conditions", async (req: Request, res: Response) => {
  const { category, condition } = req.query;
  try {
    const diabetesRecipes = await prisma.recipes.findMany({
      where: {
        category: {
          equals: category as any,
        },
        condtion: {
          has: condition as string,
        },
      },
    });
    res.json(diabetesRecipes);
  } catch (error) {
    console.error("Error fetching conditions data:", error);
    res.status(500).json({ error: "Error fetching conditions data" });
  }
});
//api to post data to food history table
app.post("/api/foodhistory", async (req: Request, res: Response) => {
  try {
    const { foodName, mealType, cookingMethod, freshness, date, userId } =
      req.body;
    // Extracting label and value from the array of objects
    const formattedFoodName = foodName.map((item: any) => {
      return { id: item.value };
    });
    const formattedCookingMethod = cookingMethod.map(
      (item: { label: string; value: string }) => ({
        label: item.label,
        value: item.value,
      })
    );

    const result = await prisma.foodhistory.create({
      data: {
        date,
        foods: {
          connect: formattedFoodName,
        },
        mealType,
        cookingMethod: formattedCookingMethod,
        freshness,
        userId: userId,
      },
    });
    console.log(result, "result ends here");
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//api to get data from foodhistory table
app.post("/api/getfoodhistory", async (req: Request, res: Response) => {
  try {
    const { date, userId } = req.body;
    console.log({ date: date });

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required." });
    }

    // Fetch data from foodhistory table including related foods and foodcategories
    const foodhistoryData = await prisma.foodhistory.findMany({
      where: {
        date: date,
        userId: userId as string,
      },
      include: {
        foods: {
          include: {
            foodcategory: true,
          },
        },
      },
    });

    console.log({ foodhistoryData: foodhistoryData });

    // Function to flatten the foodcategory arrays for each meal
    const flattenFoodCategories = (meals: typeof foodhistoryData) => {
      const flattenedCategories = meals.flatMap((meal) =>
        meal.foods.flatMap((food) =>
          food.foodcategory.map((category) => category.name)
        )
      );
      return flattenedCategories;
    };

    // Function to count the occurrences of each category
    const countCategoryOccurrences = (categories: any) => {
      const categoryCount = categories.reduce((count: any, category: any) => {
        count[category] = (count[category] || 0) + 1;
        return count;
      }, {});
      return categoryCount;
    };

    // Function to convert category count into the desired format
    const convertToChartData = (categoryCount: any) => {
      const chartData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
      }));
      return chartData;
    };
    const flattenedCategories = flattenFoodCategories(foodhistoryData);
    console.log({ flattenedCategories: flattenedCategories });
    const categoryCount = countCategoryOccurrences(flattenedCategories);
    console.log({ categoryCount: categoryCount });
    const chartData = convertToChartData(categoryCount);
    console.log({ chartData: chartData });

    return res.status(200).json(chartData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/foodnamecount", async (req: Request, res: Response) => {
  try {
    const { date, userId } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required." });
    }

    // Fetch data from foodhistory table including related foods
    const foodhistoryData = await prisma.foodhistory.findMany({
      where: {
        date: date,
        userId: userId as string,
      },
      include: {
        foods: true,
      },
    });

    // Flatten the food names array
    const flattenedFoodNames = foodhistoryData.flatMap((meal) =>
      meal.foods.map((food) => food.name)
    );

    // Count the occurrences of each food name
    const foodNameCount = flattenedFoodNames.reduce(
      (count: any, foodName: any) => {
        count[foodName] = (count[foodName] || 0) + 1;
        return count;
      },
      {}
    );

    // Convert food name count into the desired format
    const foodNameData = Object.entries(foodNameCount).map(([name, value]) => ({
      name,
      value,
    }));

    return res.status(200).json(foodNameData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new endpoint to get cooking method data
app.post("/api/cookingmethodcount", async (req: Request, res: Response) => {
  try {
    const { date, userId } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required." });
    }

    // Fetch data from foodhistory table including cooking methods
    const foodhistoryData = await prisma.foodhistory.findMany({
      where: {
        date: date,
        userId: userId as string,
      },
      select: {
        cookingMethod: true,
      },
    });

    // Flatten the cooking method arrays for each meal
    const flattenedCookingMethods = foodhistoryData.flatMap(
      (meal) => meal.cookingMethod
    );
console.log(flattenedCookingMethods,"first one")
    // Count the occurrences of each cooking method
    const cookingMethodCount = flattenedCookingMethods.reduce(
      (count: any, method: any) => {
        if (typeof method === "object" && method !== null && "label" in method) {
          const label = method.label;
          count[label] = (count[label] || 0) + 1;
        }
        return count;
      },
      {}
    );
console.log(cookingMethodCount,"second one")
    // Convert cooking method count into the desired format
    const cookingMethodChartData = Object.entries(cookingMethodCount).map(
      ([label, count]) => ({
        name: label,
        value: count,
      })
    );
console.log(cookingMethodChartData,"third one")
    return res.status(200).json(cookingMethodChartData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



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

app.get("/api/groceries", async (req: Request, res: Response) => {
  const groceries = await prisma.groceryItem.findMany();
  res.json(groceries);
});

// POST /groceries -  Add a new grocery item.....original
app.post("/api/groceries", async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  try {
    const newGroceryItem = await prisma.groceryItem.create({
      data: { name, userId },
    });
    res.status(201).json(newGroceryItem);
  } catch (error) {
    res.status(400).json({ error: "Error fetching data" });
  }
});

// PATCH /groceries/:id - Update checked status
app.patch("/api/groceries/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { checked } = req.body;

  try {
    const updatedGroceryItem = await prisma.groceryItem.update({
      where: { id: parseInt(id) },
      data: { checked },
    });
    res.json(updatedGroceryItem);
  } catch (error) {
    res.status(400).json({ error: "Error fetching data" });
  }
});

// DELETE /groceries/:id - Delete an item
app.delete("/api/groceries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.groceryItem.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: "Error fetching data" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
