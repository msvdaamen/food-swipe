import { computed, inject, Injectable } from '@angular/core';
import { RecipeStore } from './store/recipe.store';
import { RecipeStepStore } from './store/recipe-step.store';
import { RecipeIngredientStore } from './store/recipe-ingredient.store';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly recipeStore = inject(RecipeStore);
  private readonly recipeStepStore = inject(RecipeStepStore);
  private readonly recipeIngredientStore = inject(RecipeIngredientStore);

  recipes = this.recipeStore.entities;
  steps = this.recipeStepStore.entities;
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
}
