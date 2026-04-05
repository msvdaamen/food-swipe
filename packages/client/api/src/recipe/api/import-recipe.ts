import { useMutation } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";

export const importRecipe = async (api: AuthApiClient, url: string) => {
  const response = await api.fetch(`/v1/recipes/import`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  return response.json() as Promise<{ recipeId: string }>;
};

export const useRecipeImport = (onSuccess?: (data: { recipeId: string }) => void) => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (url: string) => importRecipe(api, url),
    onSuccess: (data) => onSuccess?.(data),
  });
};
