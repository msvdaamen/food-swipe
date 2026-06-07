import type { HttpClient } from "../../client";
import { objectToSearchParams } from "../../internal/search-params";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type GetRecipesInput = {};

export const getRecipes = async (api: HttpClient, payload: GetRecipesInput = {}) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/recipes?${params}`);
  const recipes = (await response.json()) as RecipeDto[];
  return recipes.map(mapRecipeDtoToModel);
};
