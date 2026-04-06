import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { recipeKeys } from "../keys";
import { getRecipesQueryOptions } from "./get-recipes";

export const deleteRecipe = async (api: AuthApiClient, recipeId: string) => {
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
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipe(api, recipeId),
    ...restConfig,
    onSuccess: (...args) => {
      const [, recipeId] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions(api, {}).queryKey, (old) =>
        old?.filter((recipe) => recipe.id !== recipeId),
      );
      onSuccess?.(...args);
    },
  });
};
