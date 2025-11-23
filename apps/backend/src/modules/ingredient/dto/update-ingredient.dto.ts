import {z} from "zod";

export const updateIngredientDto = z.object({
    name: z.string()
});

export type CreateIngredientDto = z.infer<typeof updateIngredientDto>;