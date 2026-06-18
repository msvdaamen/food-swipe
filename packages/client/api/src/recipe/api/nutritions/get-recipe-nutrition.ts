import type { RecipeNutrition } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export const getRecipeNutrition = async (api: HttpClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/nutritions`);
  return response.json() as Promise<RecipeNutrition[]>;
};
