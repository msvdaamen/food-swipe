import { type } from "arktype";

export const updateIngredientDto = type({
    name: "string"
});

export type UpdateIngredientDto = typeof updateIngredientDto.infer;
