import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/router";
import { getIngredientsDto } from "./dto/get-ingredients.dto";
import { createIngredientDto } from "./dto/create-ingredient.dto";
import { updateIngredientDto } from "./dto/update-ingredient.dto";
import { createIngredientService } from "./service";

const app = authRouterFactory.createApp();

app.get("/", sValidator("query", getIngredientsDto), async (c) => {
  const svc = createIngredientService(c.get("db"));
  const params = c.req.valid("query");
  try {
    const data = await svc.all(params);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/", sValidator("json", createIngredientDto), async (c) => {
  const svc = createIngredientService(c.get("db"));
  const payload = c.req.valid("json");
  try {
    const data = await svc.create(payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.put("/:id", sValidator("json", updateIngredientDto), async (c) => {
  const svc = createIngredientService(c.get("db"));
  const id = Number(c.req.param("id"));
  const payload = c.req.valid("json");
  try {
    const data = await svc.update(id, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.delete("/:id", async (c) => {
  const svc = createIngredientService(c.get("db"));
  const id = Number(c.req.param("id"));
  try {
    await svc.delete(id);
    return c.json({ message: "Ingredient deleted" });
  } catch {
    return c.status(500);
  }
});

export const ingredientRouter = app;
