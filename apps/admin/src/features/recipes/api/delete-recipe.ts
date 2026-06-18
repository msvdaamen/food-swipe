import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { deleteRecipe } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeRootQueryKey } from "./get-recipes";

type UseDeleteRecipeOptions = Omit<UseMutationOptions<void, Error, string>, "mutationFn">;

export const useDeleteRecipe = (config: UseDeleteRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipe(api, recipeId),
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getRecipeRootQueryKey() });
      onSuccess?.(...args);
    }
  });
};
