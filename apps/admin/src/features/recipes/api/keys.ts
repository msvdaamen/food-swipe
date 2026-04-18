export type RecipeListFilter = {
  isPublished?: boolean;
};

export const recipeKeys = {
  all: ["recipes"] as const,
  list: (payload: RecipeListFilter = {}) => [...recipeKeys.all, payload] as const,
  detail: (id: string) => [...recipeKeys.all, id] as const,
  ingredients: (recipeId: string) => [...recipeKeys.detail(recipeId), "ingredients"] as const,
  steps: (recipeId: string) => [...recipeKeys.detail(recipeId), "steps"] as const,
  nutrition: (recipeId: string) => [...recipeKeys.detail(recipeId), "nutrition"] as const,
};
