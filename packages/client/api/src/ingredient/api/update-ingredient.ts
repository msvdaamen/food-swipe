import type { Ingredient } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export type UpdateIngredientInput = {
  data: {
    name?: string;
  };
  ingredientId: number;
};

export const updateIngredient = async (api: HttpClient, payload: UpdateIngredientInput) => {
  const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<Ingredient>;
};
