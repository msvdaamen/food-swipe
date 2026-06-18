import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderRecipeSteps, type ReorderRecipeStepsInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export { type ReorderRecipeStepsInput };

function arrayMove<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  if (removed === undefined) return next;
  next.splice(toIndex, 0, removed);
  return next;
}

export const useRecipeStepsReorder = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderRecipeStepsInput) => reorderRecipeSteps(api, payload),
    onMutate: async (payload) => {
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      const previousSteps = queryClient.getQueryData<RecipeStep[]>(key);
      queryClient.setQueryData<RecipeStep[]>(key, (old) => {
        if (!old) return [];
        return arrayMove(old, payload.data.orderFrom - 1, payload.data.orderTo - 1);
      });
      return { previousSteps };
    },
    onError: (_, __, context) => {
      if (!context) return;
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      queryClient.setQueryData(key, context.previousSteps);
    }
  });
};
