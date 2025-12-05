import { type } from "arktype";

export const updateRecipeIngredientDto = type({
    "ingredientId?": "number >= 1",
    "amount?": "number >= 1",
    "measurementId?": "number >= 1 | null",
});

export type UpdateRecipeIngredientDto = typeof updateRecipeIngredientDto.infer;
