import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeBookService } from "./recipe-book.service";
import { createRecipeBookDto } from "./dto/create-recipe-book.dto";

const app = authRouter.createApp();

app.get("/", async (c) => {
	const user = c.get("user");
	const recipeBooks = await recipeBookService.getRecipeBooks(user.id);
	return c.json(recipeBooks);
});

app.post("/", async (c) => {
	const user = c.get("user");
	const payload = createRecipeBookDto.parse(await c.req.json());
	const recipeBook = await recipeBookService.createRecipeBook(user.id, payload);
	return c.json(recipeBook);
});

export function registerRecipeBookController(instance: Hono) {
	instance.route("/v1/recipe-books", app);
}
