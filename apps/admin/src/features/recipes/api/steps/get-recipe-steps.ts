import { useQuery, queryOptions } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";

export const getRecipeSteps = (recipeId: number) => {
  return httpApi.get<RecipeStep[]>(`/v1/recipes/${recipeId}/steps`);
}

export const getRecipeStepsQueryOptions = (recipeId: number) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "steps"],
    queryFn: () => getRecipeSteps(recipeId),
  });
}

export const useRecipeSteps = (recipeId: number) => useQuery(getRecipeStepsQueryOptions(recipeId));
