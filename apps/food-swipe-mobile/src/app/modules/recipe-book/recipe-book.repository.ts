import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { RecipeBook } from './types/recipe-book';
import { addEntity, setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, switchMap, tap } from 'rxjs';
import { RecipeBookService } from './recipe-book.service';
import { mapResponse, tapResponse } from '@ngrx/operators';
import { CreateRecipeBookRequest } from './requests/create-recipe-book.request';
type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

@Injectable({
  providedIn: 'root',
})
export class RecipeBookRepository extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<RecipeBook>(),
) {
  private readonly service = inject(RecipeBookService);

  loadAll = rxMethod<void>(
    pipe(
      tap(() => patchState(this, { isLoading: true })),
      switchMap(() => this.service.getAll()),
      tapResponse({
        next: (books) =>
          patchState(this, { hasLoaded: true }, setEntities(books)),
        finalize: () => patchState(this, { isLoading: false }),
        error: (error) => {},
      }),
    ),
  );

  create = rxMethod<CreateRecipeBookRequest>(
    pipe(
      tap(() => patchState(this, { isLoading: true })),
      mergeMap((request) => this.service.create(request)),
      tapResponse({
        next: (book) => patchState(this, addEntity(book)),
        finalize: () => patchState(this, { isLoading: false }),
        error: (error) => {},
      }),
    ),
  );
}
