import { type } from "arktype";

export const updateRecipeNutritionDto = type({
    unit: "string",
    value: "number",
});

export type UpdateRecipeNutritionDto = typeof updateRecipeNutritionDto.infer;
