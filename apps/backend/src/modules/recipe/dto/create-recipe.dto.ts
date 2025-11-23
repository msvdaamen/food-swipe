import {z} from "zod";

export const createRecipeDto = z.object({
    title: z.string(),
    description: z.string().optional(),
    prepTime: z.number().min(1).optional(),
    servings: z.number().min(1).optional(),
    calories: z.number().min(1).optional(),
    coverImageId: z.number().min(1).optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeDto>;