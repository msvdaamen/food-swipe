import type { RecipeIngredient } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type UpdateRecipeIngredientInput = {
  recipeId: string;
  ingredientId: number;
  data: {
    amount?: number;
    measurementId?: number | null;
  };
};

export const updateRecipeIngredient = async (
  api: HttpClient,
  payload: UpdateRecipeIngredientInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeIngredient>;
};
