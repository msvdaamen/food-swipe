import type { RecipeIngredient } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type CreateRecipeIngredientInput = {
  recipeId: string;
  data: {
    ingredientId: number;
    amount: number;
    measurementId: number | null;
  };
};

export const createRecipeIngredient = async (
  api: HttpClient,
  payload: CreateRecipeIngredientInput,
) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/ingredients`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeIngredient>;
};
