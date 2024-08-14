import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeService } from "./recipe.service";
import type {RecipeModel} from "./models/recipe.model.ts";

const app = authRouter.createApp();

app.get('/', async (c) => {
    const recipes = await recipeService.getAll();
    return c.json(recipes.map(formatRecipe));
});

app.get('/:id', async (c) => {
    const recipe = await recipeService.getById(c.req.param('id'));
    return c.json(formatRecipe(recipe));
});


const formatRecipe = (recipe: RecipeModel) => {
    return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        coverImageUrl: recipe.coverImageUrl,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
    }
}


export const registerRecipeController = (instance: Hono) => {
    instance.route('/v1/recipes', app);
}