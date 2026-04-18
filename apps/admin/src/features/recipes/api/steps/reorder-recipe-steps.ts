import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

function arrayMove<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  if (removed === undefined) return next;
  next.splice(toIndex, 0, removed);
  return next;
}

export type ReorderRecipeStepsInput = {
  recipeId: string;
  stepId: number;
  data: {
    orderFrom: number;
    orderTo: number;
  };
};

export const reorderRecipeSteps = async (payload: ReorderRecipeStepsInput) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/steps/${payload.stepId}/reorder`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeStep[]>;
};

export const useRecipeStepsReorder = (recipeId: string) => {
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
