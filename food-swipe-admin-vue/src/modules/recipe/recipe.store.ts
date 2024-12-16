import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import { recipeApi } from '@/modules/recipe/recipe.api'
import type { RecipeStep } from '@/modules/recipe/types/recipe-step.type'
import type { RecipeIngredient } from '@/modules/recipe/types/recipe-ingredient.type'

export const useRecipeStore = defineStore('recipes', () => {
  const ids = ref<number[]>([])
  const entities = ref<Record<number, Recipe>>({})

  const steps = ref<RecipeStep[]>([])
  const ingredients = ref<RecipeIngredient[]>([])

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

  function getRecipe(id: number) {
    return computed(() => entities.value[id])
  }

  async function loadRecipes() {
    const response = await recipeApi.getAll()
    const recipes = response.data
    ids.value = recipes.map((recipe) => recipe.id)
    const newEntities: Record<number, Recipe> = {}
    for (const recipe of recipes) {
      newEntities[recipe.id] = recipe
    }
    entities.value = newEntities
  }

  async function loadRecipe(id: number) {
    const response = await recipeApi.get(id)
    const recipe = response.data
    if (!ids.value.some((id) => id === recipe.id)) {
      ids.value = [...ids.value, recipe.id]
    }
    entities.value = {
      ...entities.value,
      [recipe.id]: recipe,
    }
  }

  async function loadSteps(recipeId: number) {
    const response = await recipeApi.getSteps(recipeId)
    steps.value = response.data
  }

  async function loadIngredients(recipeId: number) {
    const response = await recipeApi.getIngredients(recipeId)
    ingredients.value = response.data
  }

  function setSteps(newSteps: RecipeStep[]) {
    steps.value = newSteps
  }

  return {
    ids,
    entities,
    recipes,
    steps,
    ingredients,
    getRecipe,
    loadRecipes,
    loadRecipe,
    loadSteps,
    loadIngredients,
    setSteps,
  }
})
