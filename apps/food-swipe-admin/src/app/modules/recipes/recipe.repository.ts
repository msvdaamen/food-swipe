import { computed, inject, Injectable } from '@angular/core';
import { RecipeStore } from './store/recipe.store';
import { RecipeStepStore } from './store/recipe-step.store';
import { RecipeIngredientStore } from './store/recipe-ingredient.store';
import { CreateRecipeStepRequest } from '@modules/recipes/requests/create-recipe-step.request';
import { CreateRecipeIngredientRequest } from '@modules/recipes/requests/create-recipe-ingredient.request';
import { ReorderRecipeStepsRequest } from '@modules/recipes/requests/reorder-recipe-steps.request';
import { UpdateRecipeIngredientRequest } from '@modules/recipes/requests/update-recipe-ingredient.request';
import { UpdateRecipeRequest } from '@modules/recipes/requests/update-recipe.request';
import { LoadRecipesRequest } from '@modules/recipes/requests/load-recipes.request';
import { CreateRecipeRequest } from '@modules/recipes/requests/create-recipe.request';
import { RecipeNutritionStore } from '@modules/recipes/store/recipe.nutrition.store';
import { Nutrition } from '@modules/recipes/constants/nutritions';
import { UpdateRecipeNutritionRequest } from '@modules/recipes/requests/update-recipe-nutrition.request';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly recipeStore = inject(RecipeStore);
  private readonly recipeStepStore = inject(RecipeStepStore);
  private readonly recipeIngredientStore = inject(RecipeIngredientStore);
  private readonly recipeNutritionStore = inject(RecipeNutritionStore);

  recipes = this.recipeStore.entities;
  steps = this.recipeStepStore.entities;
  stepEntities = this.recipeStepStore.entityMap;
  ingredients = this.recipeIngredientStore.entities;
  ingredientEntities = this.recipeIngredientStore.entityMap;

  nutritions = this.recipeNutritionStore.entities;

  isLoading = this.recipeStore.isLoading;

  getRecipe(id: number) {
    return computed(() => {
      const entities = this.recipeStore.entityMap();
      return entities[id];
    });
  }

  getStep(recipeId: number, stepId: number) {
    return computed(() => {
      const entities = this.recipeStepStore.entityMap();
      return entities[stepId];
    });
  }

  getIngredient(recipeId: number, ingredientId: number) {
    return computed(() => {
      const entities = this.recipeIngredientStore.entityMap();
      console.log(entities);
      return entities[ingredientId];
    });
  }

  loadRecipes(payload: LoadRecipesRequest = {}) {
    this.recipeStore.loadAll(payload);
  }

  loadRecipe(id: number) {
    this.recipeStore.loadOne(id);
  }

  createRecipe(payload: CreateRecipeRequest) {
    this.recipeStore.create(payload);
  }

  updateRecipe(id: number, payload: UpdateRecipeRequest) {
    this.recipeStore.update(id, payload);
  }

  uploadImage(id: number, file: File) {
    this.recipeStore.uploadImage({ id, file });
  }

  importRecipe(url: string) {
    this.recipeStore.importRecipe(url);
  }

  deleteRecipe(id: number) {
    this.recipeStore.delete(id);
  }

  loadSteps(recipeId: number) {
    this.recipeStepStore.loadAll(recipeId);
  }

  loadIngredients(recipeId: number) {
    this.recipeIngredientStore.loadAll(recipeId);
  }

  createStep(recipeId: number, payload: CreateRecipeStepRequest) {
    this.recipeStepStore.createStep({ recipeId, payload });
  }

  updateStep(
    recipeId: number,
    stepId: number,
    payload: CreateRecipeStepRequest,
  ) {
    this.recipeStepStore.updateStep({ recipeId, stepId, payload });
  }

  deleteStep(recipeId: number, stepId: number) {
    this.recipeStepStore.deleteStep({ recipeId, stepId });
  }

  reorderSteps(
    recipeId: number,
    stepId: number,
    payload: ReorderRecipeStepsRequest,
  ) {
    this.recipeStepStore.reorderSteps({ recipeId, stepId, payload });
  }

  createIngredient(recipeId: number, payload: CreateRecipeIngredientRequest) {
    this.recipeIngredientStore.createIngredients({ recipeId, payload });
  }

  updateIngredient(
    recipeId: number,
    ingredientId: number,
    payload: UpdateRecipeIngredientRequest,
  ) {
    this.recipeIngredientStore.updateIngredient({
      recipeId,
      ingredientId,
      payload,
    });
  }

  deleteIngredient(recipeId: number, ingredientId: number) {
    this.recipeIngredientStore.deleteIngredient({ recipeId, ingredientId });
  }

  loadNutritions(recipeId: number) {
    this.recipeNutritionStore.loadAll(recipeId);
  }

  updateNutrition(
    recipeId: number,
    name: Nutrition,
    payload: UpdateRecipeNutritionRequest,
  ) {
    this.recipeNutritionStore.updateNutrition({ recipeId, name, payload });
  }
}
