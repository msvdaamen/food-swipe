import { Nutrition } from "@food-swipe/types";
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
  RecipeIngredientModel,
  RecipeModel,
  RecipeNutritionModel,
  RecipeStepModel
} from "../models";

export interface RecipeRepository {
  create(payload: CreateRecipeDto): Promise<RecipeModel>;
  update(id: string, payload: UpdateRecipeDto): Promise<RecipeModel>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<RecipeModel>;
  getAll(filters: LoadRecipesDto): Promise<RecipeModel[]>;
  reorderSteps(
    recipeId: string,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ): Promise<RecipeStepModel[]>;
  like(recipeBookId: number, recipeId: string, like: boolean): Promise<RecipeModel>;

  getSteps(recipeId: string): Promise<RecipeStepModel[]>;
  createStep(recipeId: string, payload: CreateRecipeStepDto): Promise<RecipeStepModel>;
  updateStep(
    recipeId: string,
    stepId: number,
    payload: UpdateRecipeStepDto
  ): Promise<RecipeStepModel>;
  deleteStep(recipeId: string, stepId: number): Promise<void>;

  getIngredients(recipeId: string): Promise<RecipeIngredientModel[]>;
  getIngredient(recipeId: string, ingredientId: number): Promise<RecipeIngredientModel>;
  createIngredient(
    recipeId: string,
    payload: CreateRecipeIngredientDto
  ): Promise<RecipeIngredientModel>;
  updateIngredient(
    recipeId: string,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<RecipeIngredientModel>;
  deleteIngredient(recipeId: string, ingredientId: number): Promise<void>;

  getNutrition(recipeId: string): Promise<RecipeNutritionModel[]>;
  updateNutrition(
    recipeId: string,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<RecipeNutritionModel>;
}
