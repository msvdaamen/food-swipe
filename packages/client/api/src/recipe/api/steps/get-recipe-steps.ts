import type { RecipeStep } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export const getRecipeSteps = async (api: HttpClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/steps`);
  return response.json() as Promise<RecipeStep[]>;
};
