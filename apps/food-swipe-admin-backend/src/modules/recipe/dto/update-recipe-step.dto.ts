import {z} from "zod";

export const updateRecipeStepDto = z.object({
    description: z.string().optional(),
    order: z.number().optional(),
});

export type UpdateRecipeStepDto = z.infer<typeof updateRecipeStepDto>;