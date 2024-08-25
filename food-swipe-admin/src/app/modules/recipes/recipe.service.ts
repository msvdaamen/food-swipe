import { Injectable } from '@angular/core';
import { Service } from '../../common/service';
import { Recipe } from './types/recipe.type';
import { RecipeStep } from './types/recipe-step.type';
import { RecipeIngredient } from './types/recipe-ingredient.type';

@Injectable({ providedIn: 'root' })
export class RecipeService extends Service {
  getAll() {
    return this.http.get<Recipe[]>(`${this.api}/recipes`);
  }

  getById(id: number) {
    return this.http.get<Recipe>(`${this.api}/recipes/${id}`);
  }

  getSteps(id: number) {
    return this.http.get<RecipeStep[]>(`${this.api}/recipes/${id}/steps`);
  }

  getIngredients(id: number) {
    return this.http.get<RecipeIngredient[]>(
      `${this.api}/recipes/${id}/ingredients`,
    );
  }
}
