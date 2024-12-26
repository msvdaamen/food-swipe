import {z} from "zod";

export const reorderRecipeStepDto = z.object({
    orderFrom: z.number().min(1),
    orderTo: z.number().min(1),
});

export type ReorderRecipeStepDto = z.infer<typeof reorderRecipeStepDto>;