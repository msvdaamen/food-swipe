import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  SelectEntityId,
  setAllEntities,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { RecipeService } from '../recipe.service';
import { RecipeIngredient } from '../types/recipe-ingredient.type';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CreateRecipeIngredientRequest } from '@modules/recipes/requests/create-recipe-ingredient.request';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UpdateRecipeIngredientRequest } from '@modules/recipes/requests/update-recipe-ingredient.request';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

const selectId: SelectEntityId<RecipeIngredient> = (ingredient) =>
  ingredient.ingredientId;

@Injectable({ providedIn: 'root' })
export class RecipeIngredientStore extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<RecipeIngredient>(),
) {
  private readonly recipeService = inject(RecipeService);

  loadAll(recipeId: number) {
    patchState(this, { isLoading: true }, removeAllEntities());
    this.recipeService.getIngredients(recipeId).subscribe({
      next: (ingredients) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setAllEntities(ingredients, { selectId }),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  createIngredients = rxMethod<{
    recipeId: number;
    payload: CreateRecipeIngredientRequest;
  }>(
    pipe(
      switchMap(({ recipeId, payload }) =>
        this.recipeService.createIngredient(recipeId, payload).pipe(
          tapResponse({
            next: (ingredient) =>
              patchState(this, addEntity(ingredient, { selectId })),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );

  updateIngredient = rxMethod<{
    recipeId: number;
    ingredientId: number;
    payload: UpdateRecipeIngredientRequest;
  }>(
    pipe(
      switchMap(({ recipeId, ingredientId, payload }) =>
        this.recipeService
          .updateIngredient(recipeId, ingredientId, payload)
          .pipe(
            tapResponse({
              next: (ingredient) =>
                patchState(
                  this,
                  removeEntity(ingredientId),
                  setEntity(ingredient, { selectId }),
                ),
              error: (err) => console.error(err),
            }),
          ),
      ),
    ),
  );

  deleteIngredient = rxMethod<{ recipeId: number; ingredientId: number }>(
    pipe(
      switchMap(({ recipeId, ingredientId }) =>
        this.recipeService.deleteIngredient(recipeId, ingredientId).pipe(
          tapResponse({
            next: () => patchState(this, removeEntity(ingredientId)),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );
}
