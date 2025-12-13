import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Recipe } from "../types/recipe.type";

export const getRecipe = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`);
  return response.json() as Promise<Recipe>;
}

export const getRecipeQueryOptions = (recipeId: string) => queryOptions({
  queryKey: ["recipes", recipeId],
  queryFn: () => getRecipe(recipeId),
})

export const useRecipe = ({ recipeId }: { recipeId: string }) => useQuery(getRecipeQueryOptions(recipeId))
