import { computed, inject, Injectable } from '@angular/core';
import { RecipeStore } from './store/recipe.store';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly recipeStore = inject(RecipeStore);

  recipes = this.recipeStore.entities;

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
}
