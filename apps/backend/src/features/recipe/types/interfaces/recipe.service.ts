import { AuthUser } from "../../../auth/auth-user.type";
import { CreateRecipeIngredientDto } from "../../dto/create-recipe-ingredient.dto";
import { CreateRecipeStepDto } from "../../dto/create-recipe-step.dto";
import { CreateRecipeDto } from "../../dto/create-recipe.dto";
import { LoadRecipesDto } from "../../dto/load-recipes.dto";
import { ReorderRecipeStepDto } from "../../dto/reorder-recipe-step.dto";
import { UpdateRecipeNutritionDto } from "../../dto/update-nutrition.dto";
import { UpdateRecipeIngredientDto } from "../../dto/update-recipe-ingredient.dto";
import { UpdateRecipeStepDto } from "../../dto/update-recipe-step.dto";
import { UpdateRecipeDto } from "../../dto/update-recipe.dto";
import {
  Recipe,
  RecipeIngredient,
  RecipeNutrition,
  RecipeStep,
  Nutrition
} from "@food-swipe/types";

export interface RecipeService {
  getAll(user: AuthUser, filters: LoadRecipesDto): Promise<Recipe[]>;
  getById(recipeId: string): Promise<Recipe>;
  create(payload: CreateRecipeDto): Promise<Recipe>;
  update(recipeId: string, payload: UpdateRecipeDto): Promise<Recipe>;
  uploadImage(recipeId: string, file: File): Promise<Recipe>;
  delete(recipeId: string): Promise<void>;
  like(userId: string, recipeId: string, like: boolean): Promise<Recipe>;

  getSteps(recipeId: string): Promise<RecipeStep[]>;
  createStep(recipeId: string, payload: CreateRecipeStepDto): Promise<RecipeStep>;
  updateStep(recipeId: string, stepId: number, payload: UpdateRecipeStepDto): Promise<RecipeStep>;
  deleteStep(recipeId: string, stepId: number): Promise<void>;
  reorderSteps(
    recipeId: string,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ): Promise<RecipeStep[]>;

  getIngredients(recipeId: string): Promise<RecipeIngredient[]>;
  getIngredient(recipeId: string, ingredientId: number): Promise<RecipeIngredient>;
  createIngredient(recipeId: string, payload: CreateRecipeIngredientDto): Promise<RecipeIngredient>;
  updateIngredient(
    recipeId: string,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<RecipeIngredient>;
  deleteIngredient(recipeId: string, ingredientId: number): Promise<void>;

  getNutrition(recipeId: string): Promise<RecipeNutrition[]>;
  updateNutrition(
    recipeId: string,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<RecipeNutrition>;
}
