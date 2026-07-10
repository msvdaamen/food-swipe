import type { HttpClient } from "../../client";
import { objectToSearchParams } from "../../internal/search-params";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type GetRecipesInput = {};

export const getRecipes = async (api: HttpClient, payload: GetRecipesInput = {}) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/recipes?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }
  const recipes = (await response.json()) as RecipeDto[];
  return recipes.map(mapRecipeDtoToModel);
};
