import { type } from "arktype";

export const updateRecipeStepDto = type({
    "description?": "string",
    "order?": "number",
});

export type UpdateRecipeStepDto = typeof updateRecipeStepDto.infer;
