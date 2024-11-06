import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  setAllEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Recipe } from '../types/recipe.type';
import { computed, inject, Injectable } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { UpdateRecipeRequest } from '@modules/recipes/requests/update-recipe.request';
import { LoadRecipesRequest } from '@modules/recipes/requests/load-recipes.request';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CreateRecipeRequest } from '@modules/recipes/requests/create-recipe.request';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

@Injectable({ providedIn: 'root' })
export class RecipeStore extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<Recipe>(),
) {
  private readonly recipeService = inject(RecipeService);

  lastCreatedRecipe = computed(() => {
    const entities = this.entities();
    if (entities.length === 0) {
      return null;
    }
    return entities[entities.length - 1];
  });

  loadAll = rxMethod<LoadRecipesRequest>(
    pipe(
      tap(() => patchState(this, { isLoading: true, hasLoaded: false })),
      switchMap((payload) =>
        this.recipeService.getAll(payload).pipe(
          tapResponse({
            next: (recipes) =>
              patchState(
                this,
                { hasLoaded: true, isLoading: false },
                setAllEntities(recipes),
              ),
            error: () =>
              patchState(this, { hasLoaded: true, isLoading: false }),
          }),
        ),
      ),
    ),
  );

  loadOne(id: number) {
    patchState(this, { isLoading: true, hasLoaded: false });
    this.recipeService.getById(id).subscribe({
      next: (recipe) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setEntity(recipe),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  create = rxMethod<CreateRecipeRequest>(
    pipe(
      tap(() => patchState(this, { isLoading: true })),
      switchMap((payload) =>
        this.recipeService.createRecipe(payload).pipe(
          tapResponse({
            next: (recipe) => {
              patchState(this, { isLoading: false }, setEntity(recipe));
            },
            error: () => {
              patchState(this, { isLoading: false });
            },
          }),
        ),
      ),
    ),
  );

  update(id: number, payload: UpdateRecipeRequest) {
    const oldRecipe = { ...this.entityMap()[id] };
    patchState(
      this,
      { isLoading: true },
      updateEntity({ id, changes: payload }),
    );
    this.recipeService.updateRecipe(id, payload).subscribe({
      next: (recipe) => {
        patchState(
          this,
          { isLoading: false },
          updateEntity({ id, changes: recipe }),
        );
      },
      error: () => {
        patchState(
          this,
          { isLoading: false },
          updateEntity({ id, changes: oldRecipe }),
        );
      },
    });
  }

  uploadImage = rxMethod<{ id: number; file: File }>(
    pipe(
      tap(() => patchState(this, { isLoading: true })),
      switchMap(({ id, file }) =>
        this.recipeService.uploadImage(id, file).pipe(
          tapResponse({
            next: (recipe) => {
              patchState(this, { isLoading: false }, updateEntity({ id, changes: recipe }));
            },
            error: () => {
              patchState(this, { isLoading: false });
            },
          }),
        ),
      ),
    ),
  );
}
