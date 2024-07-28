import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Recipe } from './types/recipe.type';
import { Service } from '../../common/service';
import { CursorPagination } from '../../common/types/cursor-pagination';

@Injectable({ providedIn: 'root' })
export class RecipeService extends Service {
  allCursor(limit: number, cursor?: number | null) {
    const params: Params = {
      limit: limit.toString(),
    };
    if (cursor) {
      params['cursor'] = cursor.toString();
    }
    return this.http.get<CursorPagination<Recipe>>(`${this.api}/recipes`, {
      params,
    });
  }

  get(id: number) {
    return this.http.get<Recipe>(`${this.api}/recipes/${id}`);
  }
}
