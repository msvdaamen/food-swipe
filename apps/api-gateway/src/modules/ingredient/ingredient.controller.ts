import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/auth.controller.ts";
import { getIngredientsDto } from "./dto/get-ingredients.dto.ts";
import { updateIngredientDto } from "./dto/update-ingredient.dto.ts";
import { createIngredientDto } from "./dto/create-ingredient.dto.ts";
import { createClient } from "@connectrpc/connect";
import { grpcTransport } from "../../lib/grpc-transport.ts";
import { Recipe } from "@food-swipe/grpc";

const app = authRouterFactory.createApp();

const client = createClient(Recipe.RecipeService, grpcTransport);

app.get("/", sValidator("query", getIngredientsDto), async (c) => {
  const params = c.req.valid("query");
  const data = await client.listIngredients(params);
  return c.json(data);
});

app.post("/", sValidator("json", createIngredientDto), async (c) => {
  const payload = c.req.valid("json");
  const ingredient = await client.createIngredient(payload);
  return c.json(ingredient.ingredient);
});

app.put("/:id", sValidator("json", updateIngredientDto), async (c) => {
  const id = Number(c.req.param("id"));
  const payload = c.req.valid("json");
  const ingredient = await client.updateIngredient({
    id,
    ...payload,
  });
  return c.json(ingredient.ingredient);
});

app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await client.deleteIngredient({ id });
  return c.json({ message: "Ingredient deleted" });
});

export function registerIngredientController(instance: Hono) {
  instance.route("/v1/ingredients", app);
}
