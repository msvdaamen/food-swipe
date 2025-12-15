import { type } from "arktype";

export const createRecipeNutritionDto = type({
  name: 'string',
  unit: 'string',
  value: 'number',
});

export type CreateRecipeNutritionDto = typeof createRecipeNutritionDto.infer
