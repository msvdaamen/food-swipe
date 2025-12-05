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
import {importRecipeDto} from "./dto/import-recipe.dto.ts";
    import {updateRecipeNutritionDto} from "./dto/update-nutrition.dto.ts";
    import {type Nutrition, nutritions} from "./constants/nutritions.ts";
import { likeRecipeDtoSchema } from "./dto/like-recipe.dto.ts";
import { sValidator } from "@hono/standard-validator";

const app = authRouter.createApp();

app.get('/', sValidator('query', loadRecipesDto), async (c) => {
    const filters = c.req.valid('query');
    const recipes = await recipeService.getAll(filters);
    return c.json(recipes);
});

app.get('/:id', async (c) => {
    const recipe = await recipeService.getById(Number(c.req.param('id')));
    return c.json(recipe);
});

app.post('/', sValidator('json', createRecipeDto), async (c) => {
    const payload = c.req.valid('json');
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
    const recipe = await recipeService.uploadImage(id, file);
    return c.json(recipe);
});

app.put('/:id', sValidator('json', updateRecipeDto), async (c) => {
    const id = Number(c.req.param('id'));
    const payload = c.req.valid('json');
    const recipe = await recipeService.update(id, payload);
    return c.json(recipe);
});

app.post('/import', sValidator('json', importRecipeDto), async (c) => {
    const body = c.req.valid('json');
    const recipe = await recipeService.importRecipe(body.url);
    return c.json(recipe);
});

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    await recipeService.delete(id);
    return c.json({}, 201);
});

app.get('/:id/steps', async (c) => {
    const steps = await recipeService.getSteps(Number(c.req.param('id')));
    return c.json(steps);
});

app.post(':id/steps', sValidator('json', createRecipeStepDto), async (c) => {
    const id = Number(c.req.param('id'));
    const payload = c.req.valid('json');
    const step = await recipeService.createStep(id, payload);
    return c.json(step);
});

app.put('/:id/steps/:stepId', sValidator('json', updateRecipeStepDto), async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    const payload = c.req.valid('json');
    const step = await recipeService.updateStep(id, stepId, payload);
    return c.json(step);
});

app.delete('/:id/steps/:stepId', async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    await recipeService.deleteStep(id, stepId);
    return c.json({}, 201);
});

app.put('/:id/steps/:stepId/reorder', sValidator('json', reorderRecipeStepDto), async (c) => {
    const id = Number(c.req.param('id'));
    const stepId = Number(c.req.param('stepId'));
    const payload = c.req.valid('json');
    const steps = await recipeService.reorderSteps(id, stepId, payload);
    return c.json(steps);
});

app.get('/:id/ingredients', async (c) => {
    const ingredients = await recipeService.getIngredients(Number(c.req.param('id')));
    return c.json(ingredients);
});

app.post(':id/ingredients', sValidator('json', createRecipeIngredientDto), async (c) => {
    const id = Number(c.req.param('id'));
    const payload = c.req.valid('json');
    const ingredient = await recipeService.createIngredient(id, payload);
    return c.json(ingredient);
});

app.put('/:id/ingredients/:ingredientId', sValidator('json', updateRecipeIngredientDto), async (c) => {
    const id = Number(c.req.param('id'));
    const ingredientId = Number(c.req.param('ingredientId'));
    const payload = c.req.valid('json');
    const ingredient = await recipeService.updateIngredient(id, ingredientId, payload);
    return c.json(ingredient);
});

app.delete('/:id/ingredients/:ingredientId', async (c) => {
    const id = Number(c.req.param('id'));
    const ingredientId = Number(c.req.param('ingredientId'));
    await recipeService.deleteIngredient(id, ingredientId);
    return c.json({}, 201);
});

app.get('/:id/nutritions', async (c) => {
    const nutritions = await recipeService.getNutrition(Number(c.req.param('id')));
    return c.json(nutritions);
});


const allowedNutritions = new Set<string>(nutritions);
app.put('/:id/nutritions/:name', sValidator('json', updateRecipeNutritionDto), async (c) => {
    const id = Number(c.req.param('id'));
    const name = c.req.param('name');
    if (!name || !allowedNutritions.has(name)) {
        return c.json({}, 400);
    }
    const payload = c.req.valid('json');
    const nutrition = await recipeService.updateNutrition(id, name as Nutrition, payload);
    return c.json(nutrition);
});

app.post('/:id/like', sValidator('json', likeRecipeDtoSchema), async (c) => {
    const id = Number(c.req.param('id'));
    const user = c.get('user');
    const {like} = c.req.valid('json');
    const {id: recipeId} = await recipeService.getById(id);
    const recipe = await recipeService.like(user.id, recipeId, like);
    return c.json(recipe);
});


export const registerRecipeController = (instance: Hono) => {
    instance.route('/v1/recipes', app);
}
