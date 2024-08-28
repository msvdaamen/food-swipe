import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeService } from "./recipe.service";
import type {RecipeModel} from "./models/recipe.model.ts";
import {createRecipeStepDto} from "./dto/create-recipe-step.dto.ts";
import {createRecipeIngredientDto} from "./dto/create-recipe-ingredient.dto.ts";
import {updateRecipeDto} from "./dto/update-recipe.dto.ts";
import {updateRecipeStepDto} from "./dto/update-recipe-step.dto.ts";
import {reorderRecipeStepDto} from "./dto/reorder-recipe-step.dto.ts";

const app = authRouter.createApp();

app.get('/', async (c) => {
    const recipes = await recipeService.getAll();
    return c.json(recipes.map(formatRecipe));
});

app.get('/:id', async (c) => {
    const recipe = await recipeService.getById(Number(c.req.param('id')));
    return c.json(formatRecipe(recipe));
});

app.put('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const payload = updateRecipeDto.parse(await c.req.json());
    const recipe = await recipeService.update(id, payload);
    return c.json(formatRecipe(recipe));
});

app.get('/:id/steps', async (c) => {
    const steps = await recipeService.getSteps(Number(c.req.param('id')));
    return c.json(steps);
});

app.post(':id/steps', async (c) => {
    const id = Number(c.req.param('id'));
    const payload = createRecipeStepDto.parse(await c.req.json());
    const step = await recipeService.createStep(id, payload);
    return c.json(step);
});

app.put('/:id/steps/:stepId', async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    const payload = updateRecipeStepDto.parse(await c.req.json());
    const step = await recipeService.updateStep(id, stepId, payload);
    return c.json(step);
});

app.delete('/:id/steps/:stepId', async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    await recipeService.deleteStep(id, stepId);
    return c.json({}, 204);
});

app.put('/:id/steps/:stepId/reorder', async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    const payload = reorderRecipeStepDto.parse(await c.req.json());
    const steps = await recipeService.reorderSteps(id, stepId, payload);
    return c.json(steps);
});

app.get('/:id/ingredients', async (c) => {
    const ingredients = await recipeService.getIngredients(Number(c.req.param('id')));
    return c.json(ingredients);
});
app.post(':id/ingredients', async (c) => {
    const id = Number(c.req.param('id'));
    const payload = createRecipeIngredientDto.parse(await c.req.json());
    const ingredient = await recipeService.createIngredient(id, payload);
    return c.json(ingredient);
})

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