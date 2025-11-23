import { z } from "zod";

export const importRecipeDto = z.object({
	url: z.string().url(),
});

export type ImportRecipeDto = z.infer<typeof importRecipeDto>;
