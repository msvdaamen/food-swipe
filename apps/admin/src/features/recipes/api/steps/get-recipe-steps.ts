import { useQuery, queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";

export const getRecipeSteps = async (recipeId: number) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/steps`);
  return response.json() as Promise<RecipeStep[]>;
}

export const getRecipeStepsQueryOptions = (recipeId: number) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "steps"],
    queryFn: () => getRecipeSteps(recipeId),
  });
}

export const useRecipeSteps = (recipeId: number) => useQuery(getRecipeStepsQueryOptions(recipeId));
