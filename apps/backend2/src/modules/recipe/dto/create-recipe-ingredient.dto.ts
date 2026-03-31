import { type } from "arktype";

export const createRecipeIngredientDto = type({
  ingredientId: 'number',
  amount: 'number >= 1',
  measurementId: 'number | null',
});

export type CreateRecipeIngredientDto = typeof createRecipeIngredientDto.infer
