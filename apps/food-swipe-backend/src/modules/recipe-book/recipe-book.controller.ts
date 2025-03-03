import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeBookService } from "./recipe-book.service";

const app = authRouter.createApp();

app.get("/", async (c) => {
  const user = c.get("user");
  const recipeBooks = await recipeBookService.getRecipeBooks(user.id);
  return c.json(recipeBooks);
});

export function registerRecipeBookController(instance: Hono) {
  instance.route("/v1/recipe-books", app);
}
