import type { Ingredient } from "../schema/ingredient.schema";
import type { RecipeStep } from "../schema/recipe-step.schema";
import type {Nutrition} from "../constants/nutritions.ts";

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
    ingredients: Ingredient[],
    steps: RecipeStep[]
    nutritions: {
        [name in Nutrition]?: {
            name: string,
            unit: string,
            value: number
        }
    }
};