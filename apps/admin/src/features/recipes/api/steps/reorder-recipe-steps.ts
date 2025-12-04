import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
};

export const reorderRecipeSteps = async (payload: ReorderRecipeStepsInput) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/steps/${payload.stepId}/reorder`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    }
  );
  return response.json() as Promise<RecipeStep[]>;
};

export const useRecipeStepsReorder = (recipeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderRecipeSteps,
    onMutate: async (payload) => {
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      const previousSteps = queryClient.getQueryData<RecipeStep[]>(key);
      queryClient.setQueryData<RecipeStep[]>(key, (old) => {
        if (!old) return [];
        return arrayMove(
          old,
          payload.data.orderFrom - 1,
          payload.data.orderTo - 1
        );
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
