import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { RecipeStep } from "../types/recipe-step.type";

export async function getRecipeSteps(id: string) {
  const response = await api.fetch(`/v1/recipes/${id}/steps`);
  if (!response.ok) {
    throw new Error("Recipe steps not found");
  }
  return response.json() as Promise<RecipeStep[]>;
}

export const getRecipeStepsOptions = (id: string) =>
  queryOptions({
    queryKey: ["recipe", id, "steps"],
    queryFn: () => getRecipeSteps(id),
  });

export const useRecipeSteps = (id: string) =>
  useQuery(getRecipeStepsOptions(id));
