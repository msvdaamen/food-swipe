import { api } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "./get-recipes";
import { Recipe } from "../types/recipe.type";

export const deleteRecipe = (recipeId: number) => {
  return api.delete<void>(`/v1/recipes/${recipeId}`);
};

type UseDeleteRecipeOptions = MutationConfig<typeof deleteRecipe>;

export const useDeleteRecipe = (config: UseDeleteRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    mutationFn: deleteRecipe,
    ...restConfig,
    onSuccess: (...args) => {
      const [,recipeId] = args;
      queryClient.invalidateQueries(getRecipesQueryOptions());
      queryClient.setQueryData<Recipe[]>(
        getRecipesQueryOptions().queryKey,
        (old) => {
          return old?.filter((recipe) => recipe.id !== recipeId);
        },
      );
      onSuccess?.(...args);
    },
  });
};
