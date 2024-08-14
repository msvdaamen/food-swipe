import { Injectable } from '@angular/core';
import { Service } from '../../common/service';
import { Recipe } from './types/recipe.type';

@Injectable({ providedIn: 'root' })
export class RecipeService extends Service {
  getAll() {
    return this.http.get<Recipe[]>(`${this.api}/recipes`);
  }

  getById(id: number) {
    return this.http.get<Recipe>(`${this.api}/recipes/${id}`);
  }
}
