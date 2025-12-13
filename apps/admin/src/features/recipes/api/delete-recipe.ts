import { api } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "./get-recipes";
import { Recipe } from "../types/recipe.type";

export const deleteRecipe = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`, {
    method: 'DELETE'
  });
  return response.json() as Promise<void>;
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
