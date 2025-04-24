import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "./get-recipes";
import { Recipe } from "../types/recipe.type";

type CreateRecipeInput = {
    title: string;
}

export const createRecipe = async (payload: CreateRecipeInput) => {
  return api.post<Recipe>('/v1/recipes', payload);
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
