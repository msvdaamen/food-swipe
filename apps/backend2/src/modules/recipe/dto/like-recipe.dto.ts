import { type } from "arktype";

export const likeRecipeDtoSchema = type({
    like: 'boolean',
});
export type LikeRecipeDto = typeof likeRecipeDtoSchema.infer;
