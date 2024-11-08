import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Recipe } from './types/recipe.type';
import { Service } from '../../common/service';
import { CursorPagination } from '../../common/types/cursor-pagination';
import { CreateRecipeRequest } from './requests/create-recipe.request';

type Filter = {
  liked?: boolean;
};

@Injectable({ providedIn: 'root' })
export class RecipeService extends Service {
  all(limit: number, cursor?: number | null, filter: Filter = {}) {
    const params: Params = {
      limit: limit.toString(),
    };
    if (cursor) {
      params['cursor'] = cursor.toString();
    }
    if (filter.liked) {
      params['liked'] = '';
    }
    return this.http.get<CursorPagination<Recipe>>(`${this.api}/recipes`, {
      params,
    });
  }

  get(id: number) {
    return this.http.get<Recipe>(`${this.api}/recipes/${id}`);
  }

  like(id: number, like: boolean) {
    return this.http.post<Recipe>(`${this.api}/recipes/${id}/like`, { like });
  }

  createRecipe(request: CreateRecipeRequest) {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('file', request.file);
    return this.http.post(`${this.api}/recipes`, formData);
  }
}
