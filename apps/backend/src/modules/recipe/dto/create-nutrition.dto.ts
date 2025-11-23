import { z } from "zod";

export const createRecipeNutritionDto = z.object({
	name: z.string(),
	unit: z.string(),
	value: z.number(),
});

export type CreateRecipeNutritionDto = z.infer<typeof createRecipeNutritionDto>;
