import { queryOptions, useQuery } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";


export const getRecipeIngredients = (recipeId: number) => {
  return httpApi.get<RecipeIngredient[]>(`/v1/recipes/${recipeId}/ingredients`);
}

export const getRecipeIngredientsQueryOptions = (recipeId: number) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "ingredients"],
    queryFn: () => getRecipeIngredients(recipeId),
  });
}

export const useRecipeIngredients = (recipeId: number) => useQuery(getRecipeIngredientsQueryOptions(recipeId))