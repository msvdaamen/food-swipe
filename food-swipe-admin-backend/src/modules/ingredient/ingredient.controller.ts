import {Hono} from "hono";
import {authRouter} from "../auth/auth.controller.ts";
import {getIngredientsDto} from "./dto/get-ingredients.dto.ts";
import {ingredientService} from "./ingredient.service.ts";
import {updateIngredientDto} from "./dto/update-ingredient.dto.ts";
import {createIngredientDto} from "./dto/create-ingredient.dto.ts";

const app = authRouter.createApp();

app.get('/', async (c) => {
    const params = getIngredientsDto.parse(c.req.query());
    const data = await ingredientService.all(params);
    return c.json(data);
});

app.post('/', async (c) => {
    const payload = createIngredientDto.parse(await c.req.json());
    const data = await ingredientService.create(payload);
    return c.json(data);
});

app.put('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const payload = updateIngredientDto.parse(await c.req.json());
    const data = await ingredientService.update(id, payload);
    return c.json(data);
});

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    await ingredientService.delete(id);
    return c.json({message: 'Ingredient deleted'});
});

export function registerIngredientController(instance: Hono) {
    instance.route('/v1/ingredients', app);
}