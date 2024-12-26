import {z} from "zod";

export const createRecipeStepDto = z.object({
    description: z.string(),
    order: z.number(),
});

export type CreateRecipeStepDto = z.infer<typeof createRecipeStepDto>;