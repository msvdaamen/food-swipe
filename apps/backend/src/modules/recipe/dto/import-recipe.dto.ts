import { type } from "arktype";

export const importRecipeDto = type({
    url: 'string.url',
});

export type ImportRecipeDto = typeof importRecipeDto.infer;
