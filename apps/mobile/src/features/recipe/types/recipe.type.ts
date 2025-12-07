import { Nutrition } from "../constants/nutritions";
import { RecipeNutrition } from "./recipe-nutrition.type";

export type Recipe = {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  prepTime: number | null;
  servings: number | null;
  isPublished: boolean;
  createdAt: string;
  nutrition: Record<Nutrition, RecipeNutrition>;
};
