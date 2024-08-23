import type { IngredientEntity } from "../schema/ingredient.schema";
import type { RecipeStepEntity } from "../schema/recipe-step.schema";

export type RecipeSerialized = {
    id: number,
    title: string,
    description: string | null,
    prepTime: number | null,
    servings: number | null,
    calories: number | null,
    isPublished: boolean,
    coverImageUrl: string | null,
    liked: boolean,
    createdAt: Date,
    updatedAt: Date
    ingredients: IngredientEntity[],
    steps: RecipeStepEntity[]
};