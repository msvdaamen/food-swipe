import type { HttpClient } from "../../client";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export const getRecipe = async (api: HttpClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`);
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};
