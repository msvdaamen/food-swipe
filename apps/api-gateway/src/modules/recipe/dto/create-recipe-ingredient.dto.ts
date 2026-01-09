import { type } from "arktype";

export const createRecipeIngredientDto = type({
  ingredientId: "number",
  amount: "number >= 1",
  "measurementId?": "number",
});

export type CreateRecipeIngredientDto = typeof createRecipeIngredientDto.infer;
