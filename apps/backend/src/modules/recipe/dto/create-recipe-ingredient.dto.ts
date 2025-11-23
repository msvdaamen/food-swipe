import { z } from "zod";

export const createRecipeIngredientDto = z.object({
	ingredientId: z.number().min(1),
	amount: z.number().min(1),
	measurementId: z.number().min(1).nullable(),
});

export type CreateRecipeIngredientDto = z.infer<
	typeof createRecipeIngredientDto
>;
