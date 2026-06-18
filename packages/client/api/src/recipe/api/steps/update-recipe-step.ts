import type { RecipeStep } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type UpdateRecipeStepInput = {
  recipeId: string;
  stepId: number;
  data: {
    description?: string;
    order?: number;
  };
};

export const updateRecipeStep = async (api: HttpClient, payload: UpdateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeStep>;
};
