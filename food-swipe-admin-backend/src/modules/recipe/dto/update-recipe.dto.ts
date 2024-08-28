import {z} from "zod";

export const updateRecipeDto = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    prepTime: z.number().min(1).optional(),
    servings: z.number().min(1).optional(),
    calories: z.number().min(1).optional(),
    isPublished: z.boolean().optional(),
});

export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;