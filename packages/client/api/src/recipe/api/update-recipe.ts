import type { HttpClient } from "../../client";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type UpdateRecipeInput = {
  recipeId: string;
  data: {
    title?: string;
    description?: string;
    prepTime?: number;
    servings?: number;
    calories?: number;
    isPublished?: boolean;
  };
};

export const updateRecipe = async (api: HttpClient, payload: UpdateRecipeInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};
