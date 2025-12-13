import { api } from "@/lib/api-client";
import { Recipe } from "../types/recipe.type";
import { queryOptions, useQuery } from "@tanstack/react-query";

export async function getRecipe(id: number) {
  const response = await api.fetch(`/v1/recipes/${id}`);
  if (!response.ok) {
    throw new Error("Recipe not found");
  }
  return response.json() as Promise<Recipe>;
}

export const getRecipeQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
  });

export const useRecipe = (id: number) => useQuery(getRecipeQueryOptions(id));
