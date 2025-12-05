import type { RecipeNutritionEntity } from "../../../schema";
import type { Nutrition } from "../constants/nutritions";

export type RecipeModel = {
  id: number;
  title: string;
  description: string | null;
  prepTime: number | null;
  servings: number | null;
  isPublished: boolean;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  nutrition: Record<Nutrition, RecipeNutritionEntity>
};
