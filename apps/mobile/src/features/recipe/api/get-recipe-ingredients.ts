import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { RecipeIngredient } from "../types/recipe-ingredient.type";

export async function getRecipeIngredients(id: string) {
  const response = await api.fetch(`/v1/recipes/${id}/ingredients`);
  if (!response.ok) {
    throw new Error("Recipe ingredients not found");
  }
  return response.json() as Promise<RecipeIngredient[]>;
}

export const getRecipeIngredientsOptions = (id: string) =>
  queryOptions({
    queryKey: ["recipe", id, "ingredients"],
    queryFn: () => getRecipeIngredients(id),
  });

export const useRecipeIngredients = (id: string) =>
  useQuery(getRecipeIngredientsOptions(id));
