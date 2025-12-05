import { type } from "arktype";

export const createIngredientDto = type({
    name: "string"
});

export type CreateIngredientDto = typeof createIngredientDto.infer;
