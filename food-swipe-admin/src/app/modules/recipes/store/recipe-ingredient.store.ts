import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  SelectEntityId,
  setEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { RecipeService } from '../recipe.service';
import { RecipeIngredient } from '../types/recipe-ingredient.type';

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
    patchState(this, { isLoading: true });
    this.recipeService.getIngredients(recipeId).subscribe({
      next: (ingredients) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setEntities(ingredients, { selectId }),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }
}
