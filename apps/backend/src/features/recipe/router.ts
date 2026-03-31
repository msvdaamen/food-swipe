import { sValidator } from "@hono/standard-validator";
import { matchError } from "better-result";
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
import { nutritions } from "./constants/nutritions";
import type { Nutrition } from "./constants/nutritions";
import { createRecipeService } from "./service";
import { createRecipeBookService } from "../recipe-book/service";

const app = authRouterFactory.createApp();

app.get("/", sValidator("query", loadRecipesDto), async (c) => {
  const user = c.get("user");
  const filters = c.req.valid("query");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.getAll(user, filters);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.get("/:id", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.getById(c.req.param("id"));
  if (result.isErr()) {
    return recipeErr(c, result.error);
  }
  return c.json(result.value);
});

app.post("/", sValidator("json", createRecipeDto), async (c) => {
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.create(payload);
  if (result.isErr()) {
    return recipeErr(c, result.error);
  }
  return c.json(result.value);
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
  const result = await svc.uploadImage(id, file);
  if (result.isErr()) {
    return recipeErr(c, result.error);
  }
  return c.json(result.value);
});

app.put("/:id", sValidator("json", updateRecipeDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.update(id, payload);
  if (result.isErr()) {
    return recipeErr(c, result.error);
  }
  return c.json(result.value);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.delete(id);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json({}, 201);
});

app.get("/:id/steps", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.getSteps(c.req.param("id"));
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.post("/:id/steps", sValidator("json", createRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.createStep(id, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.put("/:id/steps/:stepId", sValidator("json", updateRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.updateStep(id, stepId, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.delete("/:id/steps/:stepId", async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.deleteStep(id, stepId);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json({}, 201);
});

app.put("/:id/steps/:stepId/reorder", sValidator("json", reorderRecipeStepDto), async (c) => {
  const id = c.req.param("id");
  const stepId = Number(c.req.param("stepId"));
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.reorderSteps(id, stepId, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.get("/:id/ingredients", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.getIngredients(c.req.param("id"));
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.post("/:id/ingredients", sValidator("json", createRecipeIngredientDto), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.createIngredient(id, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
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
    const result = await svc.updateIngredient(id, ingredientId, payload);
    if (result.isErr()) {
      return matchError(result.error, {
        UnhandledException: () => c.status(500),
      });
    }
    return c.json(result.value);
  },
);

app.delete("/:id/ingredients/:ingredientId", async (c) => {
  const id = c.req.param("id");
  const ingredientId = Number(c.req.param("ingredientId"));
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.deleteIngredient(id, ingredientId);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json({}, 201);
});

app.get("/:id/nutritions", async (c) => {
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const result = await svc.getNutrition(c.req.param("id"));
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
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
  const result = await svc.updateNutrition(id, name as Nutrition, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.post("/:id/like", sValidator("json", likeRecipeDtoSchema), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  const { like } = c.req.valid("json");
  const recipeBooks = createRecipeBookService(c.get("db"));
  const svc = createRecipeService(c.get("db"), c.get("storage"), recipeBooks);
  const existing = await svc.getById(id);
  if (existing.isErr()) {
    const response = matchError(existing.error, {
      NotFound: (e) => c.json({ message: e.message }, 404),
      UnhandledException: (e) => c.json({ error: "Internal server error" }, 500),
    });
    return response;
  }
  const result = await svc.like(user.id, existing.value.id, like);
  if (result.isErr()) {
    const response = matchError(result.error, {
      NotFound: (e) => c.json({ message: e.message }, 404),
      UnhandledException: (e) => c.json({ error: "Internal server error" }, 500),
    });
    return response;
  }
  return c.json(result.value);
});

export const recipeRouter = app;
