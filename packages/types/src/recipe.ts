export type RecipeIngredient = {
  ingredientId: number;
  amount: number;
  measurementId: number | null;
  recipeId: string;
  ingredient: string;
  measurement: string | null;
};

export const nutritions = [
  "carbohydrates",
  "energy",
  "fat",
  "fibers",
  "protein",
  "saturatedFat",
  "sodium",
  "sugar",
] as const;

export type Nutrition = (typeof nutritions)[number];

export const nutritionOrder: Nutrition[] = [
  "energy",
  "carbohydrates",
  "sugar",
  "sodium",
  "protein",
  "fat",
  "saturatedFat",
  "fibers",
];

export const nutritionUnits = ["g", "mg", "kcal"] as const;

export type NutritionUnit = (typeof nutritionUnits)[number];

export type RecipeNutrition = {
  value: number;
  unit: string;
  id: number;
  name: string;
  recipeId: string;
};

export type RecipeStep = {
  description: string;
  id: number;
  recipeId: string;
  stepNumber: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  prepTime: number | null;
  servings: number | null;
  isPublished: boolean;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  nutrition: Partial<Record<Nutrition, RecipeNutrition>>;
};
