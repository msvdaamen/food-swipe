import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "./get-recipes";
import { Recipe } from "../types/recipe.type";

type CreateRecipeInput = {
    title: string;
}

export const createRecipe = async (payload: CreateRecipeInput) => {
  const response = await api.fetch('/v1/recipes', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.json() as Promise<Recipe>;
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (recipe) => {
      queryClient.setQueryData<Recipe[]>(
        getRecipesQueryOptions().queryKey,
        (old) => {
          return [recipe, ...(old || [])];
        },
      );
    },
  });
};
