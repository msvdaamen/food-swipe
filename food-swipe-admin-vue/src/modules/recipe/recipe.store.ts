import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import { recipeApi } from '@/modules/recipe/recipe.api'

export const useRecipeStore = defineStore('recipes', () => {
  const ids = ref<number[]>([])
  const entities = ref<Record<number, Recipe>>({})
  const recipes = computed(() => {
    const recipes: Recipe[] = []
    for (const id of ids.value) {
      if (!entities.value[id]) {
        return
      }
      recipes.push(entities.value[id])
    }
    return recipes
  })

  async function loadRecipes() {
    const response = await recipeApi.loadAll()
    const recipes = response.data
    ids.value = recipes.map((recipe) => recipe.id)
    const newEntities: Record<number, Recipe> = {}
    for (const recipe of recipes) {
      newEntities[recipe.id] = recipe
    }
    entities.value = newEntities
  }

  return {
    ids,
    entities,
    recipes,
    loadRecipes,
  }
})
