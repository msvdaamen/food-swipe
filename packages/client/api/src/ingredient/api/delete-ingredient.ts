import type { HttpClient } from "../../client";

export type DeleteIngredientInput = {
  ingredientId: number;
};

export const deleteIngredient = async (api: HttpClient, payload: DeleteIngredientInput) => {
  const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
    method: "DELETE",
  });
  return response.json();
};
