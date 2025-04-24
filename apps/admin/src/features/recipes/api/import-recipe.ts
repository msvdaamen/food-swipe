import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "../types/recipe.type";
import { api } from "@/lib/api";


export const importRecipe = (url: string) => {
  return api.post<Recipe>(`/v1/recipes/import`, { url });
}

export const useRecipeImport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importRecipe,
    onSuccess: (recipe) => {
      queryClient.setQueriesData<Recipe[]>(
        { queryKey: ["recipes"] },
        (old) => [recipe, ...(old || [])]
      );
    },
  });
}; 