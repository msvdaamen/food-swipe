import { z } from "zod";

export const updateRecipeDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  prepTime: z.preprocess((value) => (value ? Number(value) : undefined), z.number().optional()),
  servings: z.preprocess((value) => (value ? Number(value) : undefined), z.number().optional()),
  isPublished: z.boolean().optional(),
  coverImage: z.string().optional()
});
export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;
