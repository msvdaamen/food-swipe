import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { RecipeBook } from './types/recipe-book';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe } from 'rxjs';
import { RecipeBookService } from './recipe-book.service';
import { mapResponse, tapResponse } from '@ngrx/operators';

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
      mergeMap(() => this.service.getAll()),
      tapResponse({
        next: (books) =>
          patchState(this, { hasLoaded: true }, setEntities(books)),
        finalize: () => patchState(this, { isLoading: false }),
        error: (error) => {},
      }),
    ),
  );
}
