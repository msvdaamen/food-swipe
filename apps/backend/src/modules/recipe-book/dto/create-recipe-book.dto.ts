import { z } from "zod";

export const createRecipeBookDto = z.object({
	title: z.string(),
});

export type CreateRecipeBookDto = z.infer<typeof createRecipeBookDto>;
