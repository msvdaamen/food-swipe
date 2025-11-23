import { z } from "zod";

export const updateRecipeIngredientDto = z.object({
	ingredientId: z.number().min(1).optional(),
	amount: z.number().min(1).optional(),
	measurementId: z.number().min(1).optional().nullable(),
});

export type UpdateRecipeIngredientDto = z.infer<
	typeof updateRecipeIngredientDto
>;
