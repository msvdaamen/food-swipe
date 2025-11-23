import {z} from "zod";


export const updateRecipeNutritionDto = z.object({
    unit: z.string(),
    value: z.number(),
});

export type UpdateRecipeNutritionDto = z.infer<typeof updateRecipeNutritionDto>;