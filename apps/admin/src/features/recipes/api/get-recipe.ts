import { queryOptions, useQuery } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { Recipe } from "../types/recipe.type";

export const getRecipe = (recipeId: number) => {
  return httpApi.get<Recipe>(`/v1/recipes/${recipeId}`);
}

export const getRecipeQueryOptions = (recipeId: number) => queryOptions({
  queryKey: ["recipes", recipeId],
  queryFn: () => getRecipe(recipeId),
})

export const useRecipe = ({ recipeId }: { recipeId: number }) => useQuery(getRecipeQueryOptions(recipeId))