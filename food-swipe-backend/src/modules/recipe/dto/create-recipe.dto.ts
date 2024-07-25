import { z } from "zod";

export const createRecipeDtoSchema = z.object({
    title: z.string(),
    file: z.instanceof(File)
});

export type CreateRecipeDto = z.infer<typeof createRecipeDtoSchema>;