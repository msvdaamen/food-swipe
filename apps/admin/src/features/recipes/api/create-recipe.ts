import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe, type CreateRecipeInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipesQueryOptions } from "./get-recipes";

export { type CreateRecipeInput };

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipeInput) => createRecipe(api, payload),
    onSuccess: (recipe) => {
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions({}).queryKey, (old) => [
        recipe,
        ...(old ?? [])
      ]);
    }
  });
};
