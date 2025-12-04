import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "../types/recipe.type";
import { api } from "@/lib/api";


export const importRecipe = async (url: string) => {
  const response = await api.fetch(`/v1/recipes/import`, {
    method: "POST",
    body: JSON.stringify({ url })
  });
  return response.json() as Promise<Recipe>;
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
