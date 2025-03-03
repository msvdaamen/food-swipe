import { z } from "zod";

export const CreateRecipeBookDto = z.object({
  title: z.string(),
});

export type CreateRecipeBookDto = z.infer<typeof CreateRecipeBookDto>;
