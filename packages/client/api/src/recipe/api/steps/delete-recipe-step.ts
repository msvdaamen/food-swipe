import type { HttpClient } from "../../../client";

export type DeleteRecipeStepInput = {
  recipeId: string;
  stepId: number;
};

export const deleteRecipeStep = async (api: HttpClient, payload: DeleteRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, {
    method: "DELETE",
  });
  return response.json() as Promise<void>;
};
