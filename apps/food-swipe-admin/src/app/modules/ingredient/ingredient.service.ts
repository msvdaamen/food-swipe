import { Service } from '../../common/service';
import { Injectable } from '@angular/core';
import { Ingredient } from './types/ingredient.type';
import { GetIngredientsRequest } from './requests/get-ingredients.request';
import { HttpParams } from '@angular/common/http';
import { CreateIngredientRequest } from './requests/create-ingredient.request';
import { UpdateIngredientRequest } from './requests/update-ingredient.request';
import { PaginatedData } from '../../common/types/paginated-data';

@Injectable({ providedIn: 'root' })
export class IngredientService extends Service {
  getAll(payload: GetIngredientsRequest) {
    const params = new HttpParams({ fromObject: payload });

    return this.http.get<PaginatedData<Ingredient>>(`${this.api}/ingredients`, {
      params,
    });
  }

  getNext(cursor: string | null = null) {
    let params = new HttpParams();
    if (cursor) {
      params = params.set('cursor', cursor);
    }
    return this.http.get<PaginatedData<Ingredient>>(`${this.api}/ingredients`, {
      params,
    });
  }

  create(payload: CreateIngredientRequest) {
    return this.http.post<Ingredient>(`${this.api}/ingredients`, payload);
  }

  update(id: number, payload: UpdateIngredientRequest) {
    return this.http.put<Ingredient>(`${this.api}/ingredients/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/ingredients/${id}`);
  }
}
