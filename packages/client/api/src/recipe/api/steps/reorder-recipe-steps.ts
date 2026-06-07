import type { RecipeStep } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type ReorderRecipeStepsInput = {
  recipeId: string;
  stepId: number;
  data: {
    orderFrom: number;
    orderTo: number;
  };
};

export const reorderRecipeSteps = async (api: HttpClient, payload: ReorderRecipeStepsInput) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/steps/${payload.stepId}/reorder`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeStep[]>;
};
