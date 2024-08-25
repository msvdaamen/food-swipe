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
    const recipe = await recipeService.getById(Number(c.req.param('id')));
    return c.json(formatRecipe(recipe));
});

app.get('/:id/steps', async (c) => {
    const steps = await recipeService.getSteps(Number(c.req.param('id')));
    return c.json(steps);
});

app.get('/:id/ingredients', async (c) => {
    const ingredients = await recipeService.getIngredients(Number(c.req.param('id')));
    return c.json(ingredients);
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