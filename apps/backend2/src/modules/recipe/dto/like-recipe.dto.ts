import {z} from "zod";


export const likeRecipeDtoSchema = z.object({
    like: z.boolean()
});
export type LikeRecipeDto = z.infer<typeof likeRecipeDtoSchema>;