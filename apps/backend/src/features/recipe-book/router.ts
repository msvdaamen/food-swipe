import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/router";
import { createRecipeBookDto } from "./dto/create-recipe-book.dto";
import { createRecipeBookService } from "./recipe-book.service";
import { NotFoundError } from "../../common/errors/not-found.error";

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const user = c.get("user");
  const svc = createRecipeBookService(c.get("db"));
  try {
    const data = await svc.getRecipeBooks(user.id);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/", sValidator("json", createRecipeBookDto), async (c) => {
  const user = c.get("user");
  const payload = c.req.valid("json");
  const service = createRecipeBookService(c.get("db"));
  try {
    const data = await service.createRecipeBook(user.id, payload);
    return c.json(data);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.status(500);
  }
});

export const recipeBookRouter = app;
