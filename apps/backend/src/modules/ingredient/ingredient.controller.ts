import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import { authRouter } from "../auth/auth.controller.ts";
import { getIngredientsDto } from "./dto/get-ingredients.dto.ts";
import { ingredientService } from "./ingredient.service.ts";
import { updateIngredientDto } from "./dto/update-ingredient.dto.ts";
import { createIngredientDto } from "./dto/create-ingredient.dto.ts";

const app = authRouter.createApp();

app.get('/', sValidator('query', getIngredientsDto), async (c) => {
    const params = c.req.valid('query');
    const data = await ingredientService.all(params);
    return c.json(data);
});

app.post('/', sValidator('json', createIngredientDto), async (c) => {
    const payload = c.req.valid('json');
    const data = await ingredientService.create(payload);
    return c.json(data);
});

app.put('/:id', sValidator('json', updateIngredientDto), async (c) => {
    const id = Number(c.req.param('id'));
    const payload = c.req.valid('json');
    const data = await ingredientService.update(id, payload);
    return c.json(data);
});

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    await ingredientService.delete(id);
    return c.json({ message: 'Ingredient deleted' });
});

export function registerIngredientController(instance: Hono) {
    instance.route('/v1/ingredients', app);
}
