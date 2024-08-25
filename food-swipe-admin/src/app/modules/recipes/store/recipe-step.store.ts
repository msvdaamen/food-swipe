import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { RecipeService } from '../recipe.service';
import { RecipeStep } from '../types/recipe-step.type';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

@Injectable({ providedIn: 'root' })
export class RecipeStepStore extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<RecipeStep>(),
) {
  private readonly recipeService = inject(RecipeService);

  loadAll(recipeId: number) {
    patchState(this, { isLoading: true });
    this.recipeService.getSteps(recipeId).subscribe({
      next: (steps) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setEntities(steps),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }
}
