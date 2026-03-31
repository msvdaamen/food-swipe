import { type } from "arktype";

export const loadRecipesDto = type({
    "isPublished?": type("string | boolean").pipe((value) => {
        if (typeof value === "string") {
            return value === "true";
        }
        return value;
    }),
});

export type LoadRecipesDto = typeof loadRecipesDto.infer
