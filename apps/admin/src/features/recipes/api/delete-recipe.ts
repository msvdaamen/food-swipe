import { httpApi } from "@/lib/api";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "./get-recipes";

export const deleteRecipe = (recipeId: number) => {
  return httpApi.delete<void>(`/v1/recipes/${recipeId}`);
};

type UseDeleteRecipeOptions = MutationConfig<typeof deleteRecipe>;

export const useDeleteRecipe = (config: UseDeleteRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    mutationFn: deleteRecipe,
    ...restConfig,
    onSuccess: (...args) => {
      onSuccess?.(...args);
      queryClient.invalidateQueries(getRecipesQueryOptions());
    },
  });
};
