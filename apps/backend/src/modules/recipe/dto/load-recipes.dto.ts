import {z} from "zod";

export const loadRecipesDto = z.object({
    isPublished: z.preprocess(value => {
        if (typeof value === "string") {
            return value === "true";
        }
        return false;
    }, z.boolean()),
});

export type LoadRecipesDto = z.infer<typeof loadRecipesDto>;
