import type { HttpClient } from "../../client";

export const importRecipe = async (api: HttpClient, url: string) => {
  const response = await api.fetch(`/v1/recipes/import`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  return response.json() as Promise<{ recipeId: string }>;
};
