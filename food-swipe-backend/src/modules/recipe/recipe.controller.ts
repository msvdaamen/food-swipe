import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { allRecipesDtoSchema } from "./dto/all-recipes.dto";
import { recipeService } from "./recipe.service";
import { NotFoundError } from "../../common/errors/not-found.error";
import { createRecipeDtoSchema } from "./dto/create-recipe.dto";

const app = authRouter.createApp();

app.get('/', async (c) => {
    const params = allRecipesDtoSchema.parse(c.req.query());
    const recipes = await recipeService.allCursor(params.limit, params.cursor);
    return c.json(recipes);
});

app.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    try {
        const recipe = await recipeService.get(id);
        return c.json(recipe);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return c.json({ message: 'Recipe not found' }, 404);
        }
        throw e;
    }
});

app.post('/', async (c) => {
    const user = c.get('user');
    const payload = createRecipeDtoSchema.parse(await c.req.parseBody());
    const recipe = await recipeService.create(user.id, {title: payload.title}, payload.file);
    return c.json(recipe);
}); 

export const registerRecipeController = (instance: Hono) => {
    instance.route('/v1/recipes', app);
}