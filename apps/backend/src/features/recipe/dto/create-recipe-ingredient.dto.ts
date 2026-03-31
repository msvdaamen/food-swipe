import { z } from "zod";

export const createRecipeIngredientDto = z.object({
  ingredientId: z.number(),
  amount: z.number().min(1),
  measurementId: z.number().nullable()
});
export type CreateRecipeIngredientDto = z.infer<typeof createRecipeIngredientDto>;
