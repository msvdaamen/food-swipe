import type { Recipe } from "@food-swipe/types";
import type { HttpClient } from "../../client";


export type UpdateRecipeImageInput = {
  recipeId: string;
  image: File;
}

export async function updateRecipeImage(api: HttpClient, input: UpdateRecipeImageInput): Promise<Recipe> {
  const data = new FormData();
  data.append("file", input.image);
  const response = await api.fetch(`/v1/recipes/${input.recipeId}/image`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error("Failed to update recipe image");
  }

  return await response.json();
}
