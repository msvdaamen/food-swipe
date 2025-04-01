import { Recipe } from "./types/recipe.type";
import { RecipeStep } from "./types/recipe-step.type";
import { RecipeIngredient } from "./types/recipe-ingredient.type";
import { httpApi } from "@/common/api";
import { objectToSearchParams } from "@/common/lib/utils";
import { LoadRecipesRequest } from "./requests/load-recipes.request";
import { CreateRecipeRequest } from "./requests/create-recipe.request";
import { UpdateRecipeRequest } from "./requests/update-recipe.request";
import { UpdateRecipeStepRequest } from "./requests/update-recipe-step.request";
import { CreateRecipeStepRequest } from "./requests/create-recipe-step.request";
import { ReorderRecipeStepsRequest } from "./requests/reorder-recipe-steps.request";
import { CreateRecipeIngredientRequest } from "./requests/create-recipe-ingredient.request";
import { UpdateRecipeIngredientRequest } from "./requests/update-recipe-ingredient.request";
import { RecipeNutrition } from "./types/recipe-nutrition.type";
import { UpdateRecipeNutritionRequest } from "./requests/update-recipe-nutrition.request";

export class RecipeApi {
  async getAll(payload: LoadRecipesRequest = {}) {
    const params = objectToSearchParams(payload);
    return httpApi.get<Recipe[]>(`/v1/recipes?${params}`);
  }

  getById(id: number) {
    return httpApi.get<Recipe>(`/v1/recipes/${id}`);
  }

  createRecipe(payload: CreateRecipeRequest) {
    return httpApi.post<Recipe>(`/v1/recipes`, payload);
  }

  updateRecipe(id: number, payload: UpdateRecipeRequest) {
    return httpApi.put<Recipe>(`/v1/recipes/${id}`, payload);
  }

  uploadImage(id: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return httpApi.post<Recipe>(`/v1/recipes/${id}/image`, formData);
  }

  importRecipe(url: string) {
    return httpApi.post<Recipe>(`/v1/recipes/import`, { url });
  }

  deleteRecipe(id: number) {
    return httpApi.delete<void>(`/v1/recipes/${id}`);
  }

  getSteps(id: number) {
    return httpApi.get<RecipeStep[]>(`/v1/recipes/${id}/steps`);
  }

  getIngredients(id: number) {
    return httpApi.get<RecipeIngredient[]>(`/v1/recipes/${id}/ingredients`);
  }

  createStep(id: number, payload: CreateRecipeStepRequest) {
    return httpApi.post<RecipeStep>(`/v1/recipes/${id}/steps`, payload);
  }

  updateStep(id: number, stepId: number, payload: UpdateRecipeStepRequest) {
    return httpApi.put<RecipeStep>(
      `/v1/recipes/${id}/steps/${stepId}`,
      payload
    );
  }

  deleteStep(id: number, stepId: number) {
    return httpApi.delete<void>(`/v1/recipes/${id}/steps/${stepId}`);
  }

  reorderSteps(id: number, stepId: number, payload: ReorderRecipeStepsRequest) {
    return httpApi.put<RecipeStep[]>(
      `/v1/recipes/${id}/steps/${stepId}/reorder`,
      payload
    );
  }

  createIngredient(id: number, payload: CreateRecipeIngredientRequest) {
    return httpApi.post<RecipeIngredient>(
      `/v1/recipes/${id}/ingredients`,
      payload
    );
  }

  updateIngredient(
    id: number,
    ingredientId: number,
    payload: UpdateRecipeIngredientRequest
  ) {
    return httpApi.put<RecipeIngredient>(
      `/v1/recipes/${id}/ingredients/${ingredientId}`,
      payload
    );
  }

  deleteIngredient(id: number, ingredientId: number) {
    return httpApi.delete<void>(
      `/v1/recipes/${id}/ingredients/${ingredientId}`
    );
  }

  getNutritions(id: number) {
    return httpApi.get<RecipeNutrition[]>(`/v1/recipes/${id}/nutritions`);
  }

  updateNutrition(
    id: number,
    name: string,
    payload: UpdateRecipeNutritionRequest
  ) {
    return httpApi.put<RecipeNutrition>(
      `/v1/recipes/${id}/nutritions/${name}`,
      payload
    );
  }
}

export const recipeApi = new RecipeApi();
