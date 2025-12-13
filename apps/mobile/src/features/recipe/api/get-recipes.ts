import { queryOptions, useQuery } from "@tanstack/react-query";
import { Recipe } from "../types/recipe.type";
import { api } from "@/lib/api-client";

export async function getRecipes() {
  const response = await api.fetch(`/v1/recipes?isPublished=false`);
  return response.json() as Promise<Recipe[]>;
}

export const getRecipesQueryOptions = () => {
  return queryOptions({
    queryKey: ["recipes"],
    queryFn: () => getRecipes(),
  });
};

export const useRecipes = () => useQuery(getRecipesQueryOptions());
