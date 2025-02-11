import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Recipe } from '@/modules/recipe/types/recipe.type'
import { useRecipeApi } from '@/modules/recipe/recipe.api'
import type { RecipeStep } from '@/modules/recipe/types/recipe-step.type'
import type { RecipeIngredient } from '@/modules/recipe/types/recipe-ingredient.type'
import type { CreateRecipeRequest } from '@/modules/recipe/requests/create-recipe.request.ts'
import type {
  CreateRecipeIngredientRequest
} from '@/modules/recipe/requests/create-recipe-ingredient.request.ts'
import type {
  CreateRecipeStepRequest
} from '@/modules/recipe/requests/create-recipe-step.request.ts'
import type {
  UpdateRecipeIngredientRequest
} from '@/modules/recipe/requests/update-recipe-ingredient.request.ts'
import type {
  UpdateRecipeStepRequest
} from '@/modules/recipe/requests/update-recipe-step.request.ts'
import type { UpdateRecipeRequest } from '@/modules/recipe/requests/update-recipe.request.ts'

export const useRecipeStore = defineStore('recipes', () => {
  const recipeApi = useRecipeApi();

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
      ids.value.push(recipe.id);
    }
    entities.value[recipe.id] = recipe;
  }

  async function loadSteps(recipeId: number) {
    const response = await recipeApi.getSteps(recipeId)
    steps.value = response.data
  }

  async function loadIngredients(recipeId: number) {
    const response = await recipeApi.getIngredients(recipeId)
    ingredients.value = response.data
  }

  async function createRecipe(payload: CreateRecipeRequest) {
    const response = await recipeApi.createRecipe(payload)
    const recipe = response.data
    ids.value.push(recipe.id)
    entities.value[recipe.id] = recipe
  }

  async function createIngredient(recipeId: number, payload: CreateRecipeIngredientRequest) {
    const response = await recipeApi.createIngredient(recipeId, payload)
    const ingredient = response.data
    ingredients.value.push(ingredient)
  }

  async function createStep(recipeId: number, payload: CreateRecipeStepRequest) {
    const response = await recipeApi.createStep(recipeId, payload)
    const step = response.data
    steps.value.push(step)
  }

  async function updateRecipe(id: number, payload: UpdateRecipeRequest) {
    const response = await recipeApi.updateRecipe(id, payload)
    const recipe = response.data
    entities.value[recipe.id] = recipe
  }

  async function updateIngredient(recipeId: number, ingredientId: number, payload: UpdateRecipeIngredientRequest) {
    const response = await recipeApi.updateIngredient(recipeId, ingredientId, payload)
    const ingredient = response.data
    const ingredientIndex = ingredients.value.findIndex(ing => ing.ingredientId = ingredient.ingredientId)
    ingredients.value[ingredientIndex] = ingredient;
  }

  async function updateStep(recipeId: number, stepId: number, payload: UpdateRecipeStepRequest) {
    const response = await recipeApi.updateStep(recipeId, stepId, payload)
    const step = response.data;
    const stepIndex = steps.value.findIndex(stp => stp.id = step.id);
    steps.value[stepIndex] = step;
  }

  async function deleteRecipe(id: number) {
    await recipeApi.deleteRecipe(id)
    ids.value = ids.value.filter((innerId) => innerId !== id)
    delete entities.value[id]
  }

  async function deleteIngredient(recipeId: number, ingredientId: number) {
    await recipeApi.deleteIngredient(recipeId, ingredientId)
    ingredients.value = ingredients.value.filter((innerIngredient) => innerIngredient.ingredientId !== ingredientId)
  }

  async function deleteStep(recipeId: number, stepId: number) {
    await recipeApi.deleteStep(recipeId, stepId)
    steps.value = steps.value.filter((innerStep) => innerStep.id !== stepId)
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
    createRecipe,
    createIngredient,
    createStep,
    updateRecipe,
    updateIngredient,
    updateStep,
    deleteRecipe,
    deleteIngredient,
    deleteStep,
  }
})
