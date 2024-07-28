export type Recipe = {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  calories: number;
  coverImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export type RecipeIngredient = {
  id: number;
  name: string;
  measurement: string | null;
  abbreviation: string | null;
  amount: number;
};

export type RecipeStep = {
  id: number;
  description: string;
  recipeId: number;
  stepNumber: number;
};
