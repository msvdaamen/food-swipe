export type UpdateRecipeRequest = {
  title?: string;
  description?: string;
  prepTime?: number;
  servings?: number;
  calories?: number;
  isPublished?: boolean;
};
