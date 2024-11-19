import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller";
import { recipeService } from "./recipe.service";
import {createRecipeStepDto} from "./dto/create-recipe-step.dto.ts";
import {createRecipeIngredientDto} from "./dto/create-recipe-ingredient.dto.ts";
import {updateRecipeDto} from "./dto/update-recipe.dto.ts";
import {updateRecipeStepDto} from "./dto/update-recipe-step.dto.ts";
import {reorderRecipeStepDto} from "./dto/reorder-recipe-step.dto.ts";
import {updateRecipeIngredientDto} from "./dto/update-recipe-ingredient.dto.ts";
import {loadRecipesDto} from "./dto/load-recipes.dto.ts";
import {createRecipeDto} from "./dto/create-recipe.dto.ts";

const app = authRouter.createApp();

app.get('/', async (c) => {
    const filters = loadRecipesDto.parse(c.req.query());
    const recipes = await recipeService.getAll(filters);
    return c.json(recipes);
});

app.get('/:id', async (c) => {
    const recipe = await recipeService.getById(Number(c.req.param('id')));
    return c.json(recipe);
});

app.post('/', async (c) => {
    const payload = createRecipeDto.parse(await c.req.json());
    const recipe = await recipeService.create(payload);
    return c.json(recipe);
});

app.post('/:id/image', async (c) => {
    const userId = c.get('user').id;
    const id = Number(c.req.param('id'));
    const body = await c.req.parseBody()
    const file = body['file'];
    if (!file || !(file instanceof File)) {
        throw new Error('File is required');
    }
    const recipe = await recipeService.uploadImage(userId, id, file);
    return c.json(recipe);
});

app.put('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const payload = updateRecipeDto.parse(await c.req.json());
    const recipe = await recipeService.update(id, payload);
    return c.json(recipe);
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
});

app.put('/:id/ingredients/:ingredientId', async (c) => {
    const id = Number(c.req.param('id'));
    const ingredientId = Number(c.req.param('ingredientId'));
    const payload = updateRecipeIngredientDto.parse(await c.req.json());
    const ingredient = await recipeService.updateIngredient(id, ingredientId, payload);
    return c.json(ingredient);
});

app.delete('/:id/ingredients/:ingredientId', async (c) => {
    const id = Number(c.req.param('id'));
    const ingredientId = Number(c.req.param('ingredientId'));
    await recipeService.deleteIngredient(id, ingredientId);
    return c.json({}, 204);
});


export const registerRecipeController = (instance: Hono) => {
    instance.route('/v1/recipes', app);
}