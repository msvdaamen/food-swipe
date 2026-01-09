import type { Hono } from "hono";
import { authRouterFactory } from "../auth/auth.controller";
import { recipeService } from "./recipe.service";
import { createRecipeStepDto } from "./dto/create-recipe-step.dto.ts";
import { createRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto.ts";
import { updateRecipeDto } from "./dto/update-recipe.dto.ts";
import { updateRecipeStepDto } from "./dto/update-recipe-step.dto.ts";
import { reorderRecipeStepDto } from "./dto/reorder-recipe-step.dto.ts";
import { updateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto.ts";
import { loadRecipesDto } from "./dto/load-recipes.dto.ts";
import { createRecipeDto } from "./dto/create-recipe.dto.ts";
import { importRecipeDto } from "./dto/import-recipe.dto.ts";
import { updateRecipeNutritionDto } from "./dto/update-nutrition.dto.ts";
import { type Nutrition, nutritions } from "./constants/nutritions.ts";
import { likeRecipeDtoSchema } from "./dto/like-recipe.dto.ts";
import { sValidator } from "@hono/standard-validator";
import { createClient } from "@connectrpc/connect";
import { grpcTransport } from "../../lib/grpc-transport.ts";
import { Recipe } from "@food-swipe/grpc";

const app = authRouterFactory.createApp();

const client = createClient(Recipe.RecipeService, grpcTransport);

app.get("/", sValidator("query", loadRecipesDto), async (c) => {
  const filters = c.req.valid("query");
  const user = c.get("user");
  const response = await client.listRecipes({
    page: 1,
    limit: 100,
    isPublished: user.role !== "admin" ? true : filters.isPublished,
  });
  return c.json(response.data);
});

app.get("/:id", async (c) => {
  const response = await client.getRecipe({ id: c.req.param("id") });
  return c.json(response.recipe);
});

app.post("/", sValidator("json", createRecipeDto), async (c) => {
  const payload = c.req.valid("json");
  const response = await client.createRecipe(payload);
  return c.json(response.recipe);
});

app.post("/:id/image", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  const file = body["file"];
  if (!file || !(file instanceof File)) {
    throw new Error("File is required");
  }
  const imageData = new Uint8Array(await file.arrayBuffer());
  const response = await client.uploadRecipeImage({
    id,
    imageData,
  });
  return c.json(response.recipe);
});

app.put("/:id", sValidator("json", updateRecipeDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const fieldMask: string[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      fieldMask.push(key);
    }
  }
  const response = await client.updateRecipe({
    id,
    ...payload,
    fieldMask: {
      paths: fieldMask,
    },
  });
  return c.json(response.recipe);
});

app.post("/import", sValidator("json", importRecipeDto), async (c) => {
  const body = c.req.valid("json");
  const user = c.get("user");
  const recipeId = Bun.randomUUIDv7();
  recipeService.importRecipe(user.id, recipeId, body.url);
  return c.json({
    recipeId,
  });
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await client.deleteRecipe({ id });
  return c.json({}, 201);
});

app.get("/:id/steps", async (c) => {
  const response = await client.listRecipeSteps({
    recipeId: c.req.param("id"),
  });
  return c.json(response.steps);
});

app.post(":id/steps", sValidator("json", createRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const response = await client.createRecipeStep({ recipeId: id, ...payload });
  return c.json(response.step);
});

app.put(
  "/:id/steps/:stepId",
  sValidator("json", updateRecipeStepDto),
  async (c) => {
    const id = c.req.param("id");
    const stepId = Number(c.req.param("stepId"));
    const payload = c.req.valid("json");
    const response = await client.updateRecipeStep({
      recipeId: id,
      stepId,
      ...payload,
    });
    return c.json(response.step);
  },
);

app.delete("/:id/steps/:stepId", async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  await client.deleteRecipeStep({ recipeId: id, stepId });
  return c.json({}, 201);
});

app.put(
  "/:id/steps/:stepId/reorder",
  sValidator("json", reorderRecipeStepDto),
  async (c) => {
    const id = c.req.param("id");
    const stepId = Number(c.req.param("stepId"));
    const payload = c.req.valid("json");
    const response = await client.reorderRecipeStep({
      recipeId: id,
      stepId,
      ...payload,
    });
    return c.json(response.steps);
  },
);

app.get("/:id/ingredients", async (c) => {
  const response = await client.listRecipeIngredients({
    recipeId: c.req.param("id"),
  });
  return c.json(response.ingredients);
});

app.post(
  ":id/ingredients",
  sValidator("json", createRecipeIngredientDto),
  async (c) => {
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const response = await client.createRecipeIngredient({
      recipeId: id,
      ...payload,
    });
    return c.json(response.ingredient);
  },
);

app.put(
  "/:id/ingredients/:ingredientId",
  sValidator("json", updateRecipeIngredientDto),
  async (c) => {
    const id = c.req.param("id");
    const ingredientId = Number(c.req.param("ingredientId"));
    const payload = c.req.valid("json");
    const response = await client.updateRecipeIngredient({
      recipeId: id,
      ingredientId,
      ...payload,
    });
    return c.json(response.ingredient);
  },
);

app.delete("/:id/ingredients/:ingredientId", async (c) => {
  const id = c.req.param("id");
  const ingredientId = Number(c.req.param("ingredientId"));
  await client.deleteRecipeIngredient({ recipeId: id, ingredientId });
  return c.json({}, 201);
});

app.get("/:id/nutritions", async (c) => {
  const response = await client.listRecipeNutritions({
    recipeId: c.req.param("id"),
  });
  return c.json(response.nutritions);
});

const allowedNutritions = new Set<string>(nutritions);
app.put(
  "/:id/nutritions/:name",
  sValidator("json", updateRecipeNutritionDto),
  async (c) => {
    const id = c.req.param("id");
    const name = c.req.param("name");
    if (!name || !allowedNutritions.has(name)) {
      return c.json({}, 400);
    }
    const payload = c.req.valid("json");
    const response = await client.updateRecipeNutrition({
      recipeId: id,
      name,
      ...payload,
    });
    return c.json(response.nutrition);
  },
);

app.post("/:id/like", sValidator("json", likeRecipeDtoSchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const { like } = c.req.valid("json");
  const response = await client.likeRecipe({
    userId: user.id,
    recipeId: id,
    like,
  });
  return c.json(response.recipe);
});

export const registerRecipeController = (instance: Hono) => {
  instance.route("/v1/recipes", app);
};
