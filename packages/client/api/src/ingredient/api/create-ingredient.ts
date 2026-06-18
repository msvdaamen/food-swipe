import type { Ingredient } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export type CreateIngredientInput = {
  data: {
    name: string;
  };
};

export const createIngredient = async (api: HttpClient, payload: CreateIngredientInput) => {
  const response = await api.fetch("/v1/ingredients", {
    body: JSON.stringify(payload.data),
    method: "POST",
  });
  return response.json() as Promise<Ingredient>;
};
