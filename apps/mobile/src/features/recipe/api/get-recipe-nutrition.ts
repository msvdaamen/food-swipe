import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { RecipeNutrition } from "../types/recipe-nutrition.type";

export async function getRecipeNutrition(id: number) {
  const response = await api.fetch(`/v1/recipes/${id}/nutritions`);
  if (!response.ok) {
    throw new Error("Recipe nutrition not found");
  }
  return response.json() as Promise<RecipeNutrition[]>;
}

export const getRecipeNutritionOptions = (id: number) =>
  queryOptions({
    queryKey: ["recipe", id, "nutrition"],
    queryFn: () => getRecipeNutrition(id),
  });

export const useRecipeNutrition = (id: number) =>
  useQuery(getRecipeNutritionOptions(id));
