import { computed, inject, Injectable } from '@angular/core';
import { IngredientStore } from './stores/ingredient.store';
import { GetIngredientsRequest } from './requests/get-ingredients.request';
import { CreateIngredientRequest } from './requests/create-ingredient.request';
import { UpdateIngredientRequest } from './requests/update-ingredient.request';

@Injectable({ providedIn: 'root' })
export class IngredientRepository {
  private readonly ingredientStore = inject(IngredientStore);

  ingredients = this.ingredientStore.entities;
  entityMap = this.ingredientStore.entityMap;
  pagination = this.ingredientStore.pagination;

  get(id: number) {
    return computed(() => this.entityMap()[id]);
  }

  loadAll(payload: GetIngredientsRequest) {
    this.ingredientStore.loadAll(payload);
  }

  create(ingredient: CreateIngredientRequest) {
    this.ingredientStore.create(ingredient);
  }

  update(id: number, ingredient: UpdateIngredientRequest) {
    this.ingredientStore.update(id, ingredient);
  }

  delete(id: number) {
    this.ingredientStore.delete(id);
  }
}
