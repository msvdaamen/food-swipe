import { authHttpClient } from '@/common/auth-http.client'
import type { LoadRecipesRequest } from '@/modules/recipe/requests/load-recipes.request'
import type { Recipe } from '@/modules/recipe/types/recipe.type'

function loadAll(payload: LoadRecipesRequest = {}) {
  return authHttpClient.get<Recipe[]>('/recipes', { params: payload })
}

export const recipeApi = {
  loadAll,
}
