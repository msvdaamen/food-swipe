import { sValidator } from "@hono/standard-validator";
import { NotFoundError } from "../../common/errors/not-found.error";
import { authRouterFactory } from "../auth/router";
import { loadRecipesDto } from "./dto/load-recipes.dto";
import { createRecipeDto } from "./dto/create-recipe.dto";
import { updateRecipeDto } from "./dto/update-recipe.dto";
import { createRecipeStepDto } from "./dto/create-recipe-step.dto";
import { updateRecipeStepDto } from "./dto/update-recipe-step.dto";
import { reorderRecipeStepDto } from "./dto/reorder-recipe-step.dto";
import { createRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto";
import { updateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto";
import { updateRecipeNutritionDto } from "./dto/update-nutrition.dto";
import { likeRecipeDtoSchema } from "./dto/like-recipe.dto";
import { nutritions, type Nutrition } from "@food-swipe/types";
import { createRecipeService } from "./recipe-service";
import { createRecipeBookService } from "../recipe-book/recipe-book.service";
import { HTTPException } from "hono/http-exception";

const app = authRouterFactory.createApp();

app.get("/", sValidator("query", loadRecipesDto), async (c) => {
  const user = c.get("user");
  const filters = c.req.valid("query");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.getAll(user, filters);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.get("/:id", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.getById(c.req.param("id"));
    return c.json(data);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    throw new HTTPException(500, { cause: e });
  }
});

app.post("/", sValidator("json", createRecipeDto), async (c) => {
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.create(payload);
    return c.json(data);
  } catch (e) {
    console.error(e);
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    throw new HTTPException(500, { cause: e });
  }
});

app.post("/:id/image", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  const file = body["file"];
  if (!file || !(file instanceof File)) {
    return c.json({ error: "File is required" }, 400);
  }
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.uploadImage(id, file);
    return c.json(data);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.status(500);
  }
});

app.put("/:id", sValidator("json", updateRecipeDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.update(id, payload);
    return c.json(data);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.status(500);
  }
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    await svc.delete(id);
    return c.json({}, 201);
  } catch {
    return c.status(500);
  }
});

app.get("/:id/steps", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.getSteps(c.req.param("id"));
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/:id/steps", sValidator("json", createRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.createStep(id, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.put("/:id/steps/:stepId", sValidator("json", updateRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.updateStep(id, stepId, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.delete("/:id/steps/:stepId", async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    await svc.deleteStep(id, stepId);
    return c.json({}, 201);
  } catch {
    return c.status(500);
  }
});

app.put("/:id/steps/:stepId/reorder", sValidator("json", reorderRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.reorderSteps(id, stepId, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.get("/:id/ingredients", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.getIngredients(c.req.param("id"));
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/:id/ingredients", sValidator("json", createRecipeIngredientDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.createIngredient(id, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.put(
  "/:id/ingredients/:ingredientId",
  sValidator("json", updateRecipeIngredientDto),
  async (c) => {
    const id = c.req.param("id");
    const ingredientId = Number(c.req.param("ingredientId"));
    const payload = c.req.valid("json");
    const recipeBooks = createRecipeBookService(c.get("db"));
    const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
    try {
      const data = await svc.updateIngredient(id, ingredientId, payload);
      return c.json(data);
    } catch {
      return c.status(500);
    }
  }
);

app.delete("/:id/ingredients/:ingredientId", async (c) => {
  const id = c.req.param("id");
  const ingredientId = Number(c.req.param("ingredientId"));
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    await svc.deleteIngredient(id, ingredientId);
    return c.json({}, 201);
  } catch {
    return c.status(500);
  }
});

app.get("/:id/nutritions", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.getNutrition(c.req.param("id"));
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

const allowedNutritions = new Set<string>(nutritions);
app.put("/:id/nutritions/:name", sValidator("json", updateRecipeNutritionDto), async (c) => {
  const id = c.req.param("id");
  const name = c.req.param("name");
  if (!name || !allowedNutritions.has(name)) {
    return c.json({}, 400);
  }
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  try {
    const data = await svc.updateNutrition(id, name as Nutrition, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/:id/like", sValidator("json", likeRecipeDtoSchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const { like } = c.req.valid("json");
  const recipeBookService = createRecipeBookService(c.get("db"));
  const service = createRecipeService(c.get("db"), c.get("storage"), recipeBookService);
  try {
    const data = await service.like(user.id, id, like);
    return c.json(data);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

export const recipeRouter = app;
