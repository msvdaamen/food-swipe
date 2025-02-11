import { useAuthHttpClient } from '@/common/auth-http.client'
import type { LoadRecipesRequest } from '@/modules/recipe/requests/load-recipes.request'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import type { RecipeStep } from '@/modules/recipe/types/recipe-step.type'
import type { RecipeIngredient } from '@/modules/recipe/types/recipe-ingredient.type'
import type {
  UpdateRecipeIngredientRequest
} from '@/modules/recipe/requests/update-recipe-ingredient.request.ts'
import type {
  UpdateRecipeStepRequest
} from '@/modules/recipe/requests/update-recipe-step.request.ts'
import type { UpdateRecipeRequest } from '@/modules/recipe/requests/update-recipe.request.ts'
import type { CreateRecipeRequest } from '@/modules/recipe/requests/create-recipe.request.ts'
import type {
  CreateRecipeIngredientRequest
} from '@/modules/recipe/requests/create-recipe-ingredient.request.ts'
import type {
  CreateRecipeStepRequest
} from '@/modules/recipe/requests/create-recipe-step.request.ts'

export function useRecipeApi() {
  const authHttpClient = useAuthHttpClient();

  function getAll(payload: LoadRecipesRequest = {}) {
    return authHttpClient.get<Recipe[]>('/recipes', { params: payload })
  }

  function get(id: number) {
    return authHttpClient.get<Recipe>(`/recipes/${id}`)
  }

  function getSteps(id: number) {
    return authHttpClient.get<RecipeStep[]>(`/recipes/${id}/steps`)
  }

  function getIngredients(id: number) {
    return authHttpClient.get<RecipeIngredient[]>(`/recipes/${id}/ingredients`)
  }

  function createRecipe(payload: CreateRecipeRequest) {
    return authHttpClient.post<Recipe>('/recipes', payload);
  }

  function createIngredient(recipeId: number, payload: CreateRecipeIngredientRequest) {
    return authHttpClient.post<RecipeIngredient>(`/recipes/${recipeId}/ingredients`, payload);
  }

  function createStep(recipeId: number, payload: CreateRecipeStepRequest) {
    return authHttpClient.post<RecipeStep>(`/recipes/${recipeId}/steps`, payload);
  }

  function updateRecipe(id: number, payload: UpdateRecipeRequest) {
    return authHttpClient.put<Recipe>(`/recipes/${id}`, payload);
  }

  function updateIngredient(recipeId: number, ingredientId: number, payload: UpdateRecipeIngredientRequest) {
    return authHttpClient.put<RecipeIngredient>(`/recipes/${recipeId}/ingredients/${ingredientId}`, payload);
  }

  function updateStep(recipeId: number, stepId: number, payload: UpdateRecipeStepRequest) {
    return authHttpClient.put<RecipeStep>(`/recipes/${recipeId}/steps/${stepId}`, payload);
  }

  function deleteRecipe(id: number) {
    return authHttpClient.delete(`/recipes/${id}`);
  }

  function deleteIngredient(recipeId: number, ingredientId: number) {
    return  authHttpClient.delete(`/recipes/${recipeId}/ingredients/${ingredientId}`);
  }

  function deleteStep(recipeId: number, stepId: number) {
    return  authHttpClient.delete(`/recipes/${recipeId}/steps/${stepId}`);
  }

  return {
    getAll,
    get,
    getSteps,
    getIngredients,
    createRecipe,
    createIngredient,
    createStep,
    updateRecipe,
    updateIngredient,
    updateStep,
    deleteRecipe,
    deleteIngredient,
    deleteStep
  }
}
