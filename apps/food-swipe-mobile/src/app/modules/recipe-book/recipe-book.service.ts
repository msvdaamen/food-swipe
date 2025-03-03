import { Injectable } from '@angular/core';
import { Service } from 'src/app/common/service';
import { RecipeBook } from './types/recipe-book';

@Injectable({
  providedIn: 'root',
})
export class RecipeBookService extends Service {
  getAll() {
    return this.http.get<RecipeBook[]>(`${this.api}/recipe-books`);
  }

  getOne(id: number) {
    return this.http.get<RecipeBook>(`${this.api}/recipe-books/${id}`);
  }
}
