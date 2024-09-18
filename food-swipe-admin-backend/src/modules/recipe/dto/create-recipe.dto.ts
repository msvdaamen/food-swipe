import {z} from "zod";

export const createRecipeDto = z.object({
    title: z.string()
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;