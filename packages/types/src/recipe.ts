export type RecipeIngredient = {
    ingredientId: number;
    amount: number;
    measurementId: number | null;
    recipeId: string;
    ingredient: string;
    measurement: string | null;
  };
  export type RecipeNutrition = {
    value: number;
    unit: string;
    id: number;
    name: string;
    recipeId: string;
  }
  export type RecipeStep = {
    description: string;
    id: number;
    recipeId: string;
    stepNumber: number;
  };

  export const nutritions = [
    "carbohydrates",
    "energy",
    "fat",
    "fibers",
    "protein",
    "saturatedFat",
    "sodium",
    "sugar"
  ] as const;
  
  export type Nutrition = (typeof nutritions)[number];
  
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