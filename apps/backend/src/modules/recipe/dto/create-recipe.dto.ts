import { type } from "arktype";

export const createRecipeDto = type({
  id: "string.uuid",
  title: "string",
  description: "string",
  prepTime: "number >= 0",
  servings: "number >= 0",
  calories: "number >= 0",
  coverImage: "string",
})

export type CreateRecipeDto = typeof createRecipeDto.infer;
