import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Recipe } from "../types/recipe.type";

export const getRecipe = async (recipeId: number) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`);
  return response.json() as Promise<Recipe>;
}

export const getRecipeQueryOptions = (recipeId: number) => queryOptions({
  queryKey: ["recipes", recipeId],
  queryFn: () => getRecipe(recipeId),
})

export const useRecipe = ({ recipeId }: { recipeId: number }) => useQuery(getRecipeQueryOptions(recipeId))
