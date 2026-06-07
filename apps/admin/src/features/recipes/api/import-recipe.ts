import { useMutation } from "@tanstack/react-query";
import { importRecipe } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";

export const useRecipeImport = (onSuccess?: (data: { recipeId: string }) => void) => {
  return useMutation({
    mutationFn: (url: string) => importRecipe(api, url),
    onSuccess: (data) => onSuccess?.(data)
  });
};
