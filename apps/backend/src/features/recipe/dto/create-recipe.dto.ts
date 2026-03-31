import { z } from "zod";

export const createRecipeDto = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  prepTime: z.number().int().min(0),
  servings: z.number().int().min(0),
  coverImage: z.string().optional().default("")
});
export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
