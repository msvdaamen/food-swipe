import { api } from "@/lib/api";
import { updateRecipeImage } from "@food-swipe/client-api/recipe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipeQueryOptions } from "./get-recipe";

export const useUpdateRecipeImage = ({ recipeId }: { recipeId: string }) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (image: File) => updateRecipeImage(api, { recipeId, image }),
    onSuccess: (recipe) => {
      client.setQueryData(getRecipeQueryOptions(recipeId).queryKey, (old) => {
        if (!old) return old;
        return { ...old, coverImageUrl: recipe.coverImageUrl };
      });
    }
  });
};
