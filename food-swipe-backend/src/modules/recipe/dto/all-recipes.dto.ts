import { z } from "zod";


export const allRecipesDtoSchema = z.object({
    cursor: z.preprocess((val) => {
        const parsed = typeof val === 'string' ? parseInt(val) : null;
        if (!parsed || isNaN(parsed)) {
            return undefined;
        }
        return parsed;
    
    }, z.number().optional()),
    limit: z.preprocess((val) => {
        const parsed = typeof val === 'string' ? parseInt(val) : null;
        if (!parsed || isNaN(parsed)) {
            return null;
        }
        return parsed;
    }, z.number().lt(100).default(10)),
});

export type AllRecipesDto = z.infer<typeof allRecipesDtoSchema>;