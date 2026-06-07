import type { HttpClient } from "../../client";

export const deleteRecipe = async (api: HttpClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`, {
    method: "DELETE",
  });
  return response.json() as Promise<void>;
};
