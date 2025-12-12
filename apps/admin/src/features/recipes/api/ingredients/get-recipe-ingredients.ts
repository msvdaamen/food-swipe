import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";


export const getRecipeIngredients = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/ingredients`);
  return response.json() as Promise<RecipeIngredient[]>;
}

export const getRecipeIngredientsQueryOptions = (recipeId: string) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "ingredients"],
    queryFn: () => getRecipeIngredients(recipeId),
  });
}

export const useRecipeIngredients = (recipeId: string) => useQuery(getRecipeIngredientsQueryOptions(recipeId))
