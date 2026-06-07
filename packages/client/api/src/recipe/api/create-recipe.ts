import type { HttpClient } from "../../client";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type CreateRecipeInput = {
  title: string;
};

export const createRecipe = async (api: HttpClient, payload: CreateRecipeInput) => {
  const response = await api.fetch("/v1/recipes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};
