import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  setAllEntities,
  setEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Recipe } from '../types/recipe.type';
import { inject, Injectable } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { UpdateRecipeRequest } from '@modules/recipes/requests/update-recipe.request';

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
    patchState(this, { isLoading: true, hasLoaded: false });
    this.recipeService.getAll().subscribe({
      next: (recipes) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setAllEntities(recipes),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

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
}
