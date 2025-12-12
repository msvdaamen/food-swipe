import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type DeleteRecipeStepInput = {
  recipeId: string;
  stepId: number;
};

export const deleteRecipeStep = async (payload: DeleteRecipeStepInput) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`,
    {
      method: "DELETE",
    }
  );
  return response.json() as Promise<void>;
};

export const useRecipeStepDelete = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipeStep,
    onSuccess: (_, { stepId }) => {
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      queryClient.setQueryData<RecipeStep[]>(key, (old) =>
        old?.filter((step) => step.id !== stepId)
      );
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
