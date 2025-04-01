import { useQuery } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { LoadRecipesRequest } from "../requests/load-recipes.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "../types/recipe.type";

const keys = {
  all: ["recipes"],
  filtered: (payload?: LoadRecipesRequest) => [...keys.all, payload],
  detail: (recipeId: number) => [...keys.all, recipeId],
};

export const useRecipes = (payload?: LoadRecipesRequest) => {
  return useQuery({
    queryKey: keys.filtered(payload),
    queryFn: () => recipeApi.getAll(payload),
  });
};

export const useRecipe = ({ recipeId }: { recipeId: number }) => {
  return useQuery({
    queryKey: keys.detail(recipeId),
    queryFn: () => recipeApi.getById(recipeId),
  });
};

export function useRecipeImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => recipeApi.importRecipe(url),
    onSuccess: (recipe) => {
      queryClient.setQueriesData<Recipe[]>(
        {
          queryKey: ["recipes"],
        },
        (old) => [...(old || []), recipe]
      );
    },
  });
}
