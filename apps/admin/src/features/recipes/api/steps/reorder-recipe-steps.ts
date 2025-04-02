import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";
import { arrayMove } from "@dnd-kit/sortable";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type ReorderRecipeStepsInput = {
  recipeId: number;
  stepId: number;
  data: {
    orderFrom: number;
    orderTo: number;
  };
}

export const reorderRecipeSteps = (payload: ReorderRecipeStepsInput) => {
  return httpApi.put<RecipeStep[]>(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}/reorder`, payload.data);
}

export const useRecipeStepsReorder = ({ recipeId }: { recipeId: number }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderRecipeSteps,
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
    },
  });
}; 