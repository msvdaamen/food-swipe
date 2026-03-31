import { sValidator } from "@hono/standard-validator";
import { matchError } from "better-result";
import { authRouterFactory } from "../auth/router";
import { createRecipeBookDto } from "./dto/create-recipe-book.dto";
import { createRecipeBookService } from "./service";

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const user = c.get("user");
  const svc = createRecipeBookService(c.get("db"));
  const result = await svc.getRecipeBooks(user.id);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.post("/", sValidator("json", createRecipeBookDto), async (c) => {
  const user = c.get("user");
  const payload = c.req.valid("json");
  const svc = createRecipeBookService(c.get("db"));
  const result = await svc.createRecipeBook(user.id, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

export const recipeBookRouter = app;
