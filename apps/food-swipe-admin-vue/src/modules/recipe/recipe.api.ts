import { useAuthHttpClient } from '@/common/auth-http.client'
import type { LoadRecipesRequest } from '@/modules/recipe/requests/load-recipes.request'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import type { RecipeStep } from '@/modules/recipe/types/recipe-step.type'
import type { RecipeIngredient } from '@/modules/recipe/types/recipe-ingredient.type'

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

  return {
    getAll,
    get,
    getSteps,
    getIngredients,
  }
}
