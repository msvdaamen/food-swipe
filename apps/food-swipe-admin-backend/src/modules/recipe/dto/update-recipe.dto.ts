import {z} from "zod";

const intParser = z.preprocess((value) => {
    if (!(typeof value === "string")) {
        return undefined;
    }
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
        return null;
    }
    return intValue;
}, z.number().min(1).optional());

export const updateRecipeDto = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    prepTime: intParser,
    servings: intParser,
    isPublished: z.boolean().optional(),
});

export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;