import { type } from "arktype";

export const createRecipeBookDto = type({
  title: "string",
});

export type CreateRecipeBookDto = typeof createRecipeBookDto.infer;
