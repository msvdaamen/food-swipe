import type { IngredientEntity } from "../../ingredient/schema/ingredient.schema.ts";
import type { RecipeStepEntity } from "../schema/recipe-step.schema";

export type RecipeModel = {
    id: number,
    title: string,
    description: string | null,
    prepTime: number | null,
    servings: number | null,
    calories: number | null,
    isPublished: boolean,
    coverImageUrl: string | null,
    createdAt: Date,
    updatedAt: Date
};