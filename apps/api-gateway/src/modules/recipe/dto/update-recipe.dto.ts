import { type } from "arktype";

const intParser = type("string | undefined").pipe((value) => {
    if (typeof value !== "string") {
        return undefined;
    }
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
        return undefined;
    }
    if (intValue < 1) {
        return undefined;
    }
    return intValue;
});

export const updateRecipeDto = type({
    "title?": "string >= 1",
    "description?": "string >= 1",
    "prepTime?": intParser,
    "servings?": intParser,
    "isPublished?": "boolean",
});

export type UpdateRecipeDto = typeof updateRecipeDto.infer;
