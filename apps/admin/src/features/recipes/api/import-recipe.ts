import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";


export const importRecipe = async (url: string) => {
  const response = await api.fetch(`/v1/recipes/import`, {
    method: "POST",
    body: JSON.stringify({ url })
  });
  return response.json() as Promise<{recipeId: string}>;
}

export const useRecipeImport = (onSuccess?: (data: {recipeId: string} ) => void) => useMutation({
  mutationFn: importRecipe,
  onSuccess: (data) => onSuccess?.(data),
});
