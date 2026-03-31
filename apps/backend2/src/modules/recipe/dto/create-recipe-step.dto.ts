import { type } from "arktype";

export const createRecipeStepDto = type({
    description: 'string',
    order: 'number',
});

export type CreateRecipeStepDto = typeof createRecipeStepDto.infer;
