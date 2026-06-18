import type { RecipeIngredient } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type DeleteRecipeIngredientInput = {
  recipeId: string;
  ingredientId: number;
};

export const deleteRecipeIngredient = async (
  api: HttpClient,
  payload: DeleteRecipeIngredientInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`,
    {
      method: "DELETE",
    },
  );
  return response.json() as Promise<RecipeIngredient>;
};
