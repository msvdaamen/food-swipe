import { patchState, signalStore, withState } from '@ngrx/signals';
import { inject, Injectable } from '@angular/core';
import { RecipeNutrition } from '@modules/recipes/types/recipe-nutrition.type';
import {
  removeAllEntities,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { RecipeService } from '@modules/recipes/recipe.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Nutrition } from '@modules/recipes/constants/nutritions';
import { UpdateRecipeNutritionRequest } from '@modules/recipes/requests/update-recipe-nutrition.request';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

@Injectable({ providedIn: 'root' })
export class RecipeNutritionStore extends signalStore(
  {
    protectedState: false,
  },
  withState(initialState),
  withEntities<RecipeNutrition>(),
) {
  private readonly recipeService = inject(RecipeService);

  loadAll(recipeId: number) {
    patchState(this, { isLoading: true }, removeAllEntities());
    this.recipeService.getNutritions(recipeId).subscribe({
      next: (nutritions) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setAllEntities(nutritions),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  updateNutrition = rxMethod<{
    recipeId: number;
    name: Nutrition;
    payload: UpdateRecipeNutritionRequest;
  }>(
    pipe(
      switchMap(({ recipeId, name, payload }) =>
        this.recipeService.updateNutrition(recipeId, name, payload).pipe(
          tapResponse({
            next: (nutrition) =>
              patchState(this, removeEntity(name), setEntity(nutrition)),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );
}
