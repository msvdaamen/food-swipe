import { patchState, signalStore, withState } from '@ngrx/signals';
import { setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { Recipe } from '../types/recipe.type';
import { inject, Injectable } from '@angular/core';
import { RecipeService } from '../recipe.service';

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

  loadAll() {
    patchState(this, { isLoading: true });
    this.recipeService.getAll().subscribe({
      next: (recipes) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setEntities(recipes),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  loadOne(id: number) {
    patchState(this, { isLoading: true });
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
}
