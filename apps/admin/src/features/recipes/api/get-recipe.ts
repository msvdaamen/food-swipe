import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Recipe } from "../types/recipe.type";

export const getRecipe = (recipeId: number) => {
  return api.get<Recipe>(`/v1/recipes/${recipeId}`);
}

export const getRecipeQueryOptions = (recipeId: number) => queryOptions({
  queryKey: ["recipes", recipeId],
  queryFn: () => getRecipe(recipeId),
})

export const useRecipe = ({ recipeId }: { recipeId: number }) => useQuery(getRecipeQueryOptions(recipeId))