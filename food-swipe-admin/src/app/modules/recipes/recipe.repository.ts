import { computed, inject, Injectable } from '@angular/core';
import { RecipeStore } from './store/recipe.store';
import { RecipeStepStore } from './store/recipe-step.store';
import { RecipeIngredientStore } from './store/recipe-ingredient.store';
import { CreateRecipeStepRequest } from '@modules/recipes/requests/create-recipe-step.request';
import { CreateRecipeIngredientRequest } from '@modules/recipes/requests/create-recipe-ingredient.request';
import { ReorderRecipeStepsRequest } from '@modules/recipes/requests/reorder-recipe-steps.request';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly recipeStore = inject(RecipeStore);
  private readonly recipeStepStore = inject(RecipeStepStore);
  private readonly recipeIngredientStore = inject(RecipeIngredientStore);

  recipes = this.recipeStore.entities;
  steps = this.recipeStepStore.entities;
  stepEntities = this.recipeStepStore.entityMap;
  ingredients = this.recipeIngredientStore.entities;

  getRecipe(id: number) {
    return computed(() => {
      const entities = this.recipeStore.entityMap();
      return entities[id];
    });
  }

  loadRecipes() {
    this.recipeStore.loadAll();
  }

  loadRecipe(id: number) {
    this.recipeStore.loadOne(id);
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
    payload: CreateRecipeIngredientRequest,
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
}
