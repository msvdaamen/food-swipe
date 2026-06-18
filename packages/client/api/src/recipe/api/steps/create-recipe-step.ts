import type { RecipeStep } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type CreateRecipeStepInput = {
  recipeId: string;
  data: {
    description: string;
    order: number;
  };
};

export const createRecipeStep = async (api: HttpClient, payload: CreateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeStep>;
};
