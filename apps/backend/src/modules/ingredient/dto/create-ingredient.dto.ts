import { z } from "zod";

export const createIngredientDto = z.object({
	name: z.string(),
});

export type CreateIngredientDto = z.infer<typeof createIngredientDto>;
