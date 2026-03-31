import { z } from "zod";

export const updateIngredientDto = z.object({
  name: z.string()
});
export type UpdateIngredientDto = z.infer<typeof updateIngredientDto>;
