import { type } from "arktype";

export const reorderRecipeStepDto = type({
    orderFrom: "number >= 1",
    orderTo: "number >= 1",
});

export type ReorderRecipeStepDto = typeof reorderRecipeStepDto.infer;
