import type { RecipeIngredient } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export const getRecipeIngredients = async (api: HttpClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/ingredients`);
  return response.json() as Promise<RecipeIngredient[]>;
};
