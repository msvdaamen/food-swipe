import { z } from "zod";

export const createRecipeDto = z.object({
  title: z.string(),
  description: z.string().optional(),
  prepTime: z.number().int().min(0).optional(),
  servings: z.number().int().min(0).optional(),
  coverImage: z.string().optional()
});
export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
