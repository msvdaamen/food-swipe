import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { recipeKeys } from "./keys";
import { getRecipesQueryOptions } from "./get-recipes";

export const deleteRecipe = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`, {
    method: "DELETE",
  });
  return response.json() as Promise<void>;
};

type UseDeleteRecipeOptions = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useDeleteRecipe = (config: UseDeleteRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: deleteRecipe,
    ...restConfig,
    onSuccess: (...args) => {
      const [, recipeId] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions({}).queryKey, (old) =>
        old?.filter((recipe) => recipe.id !== recipeId),
      );
      onSuccess?.(...args);
    },
  });
};
