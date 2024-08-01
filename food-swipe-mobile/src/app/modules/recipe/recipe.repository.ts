import { computed, inject, Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { Recipe } from './types/recipe.type';
import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { CreateRecipeRequest } from './requests/create-recipe.request';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
  cursor: number | null;
  likedRecipeIds: number[];
  cursorLikedRecipes: number | null;
  hasLoadedLikedRecipes: boolean;
  createRecipeError: string | null;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
  cursor: null,
  likedRecipeIds: [],
  cursorLikedRecipes: null,
  hasLoadedLikedRecipes: false,
  createRecipeError: null,
};

@Injectable({ providedIn: 'root' })
export class RecipeRepository extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<Recipe>(),
) {
  private readonly service = inject(RecipeService);

  recipes = this.entities;
  likedRecipes = computed(() => {
    const ids = this.likedRecipeIds();
    const recipes: Recipe[] = [];
    for (const id of ids) {
      recipes.push(this.entityMap()[id]);
    }
    return recipes;
  });

  getRecipe(id: number) {
    return computed(() => {
      return this.entityMap()[id];
    });
  }

  loadAll({ limit, cursor }: { limit: number; cursor?: number | null }) {
    if (this.hasLoaded() && !cursor) {
      return;
    }
    patchState(this, { isLoading: true });
    this.service.all(limit, cursor).subscribe({
      next: (response) => {
        patchState(this, addEntities(response.data), {
          cursor: response.cursor,
          hasLoaded: true,
        });
      },
      error: (err) => {
        patchState(this, { isLoading: false });
        console.error(err);
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  loadOne(id: number) {
    patchState(this, { isLoading: true });
    this.service.get(id).subscribe({
      next: (recipe) => {
        patchState(this, addEntity(recipe));
      },
      error: (err) => {
        patchState(this, { isLoading: false });
        console.error(err);
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  loadLikedRecipes({
    limit,
    cursor,
  }: {
    limit: number;
    cursor?: number | null;
  }) {
    if (this.hasLoadedLikedRecipes() && !cursor) {
      return;
    }
    patchState(this, { isLoading: true });
    this.service.all(limit, cursor, { liked: true }).subscribe({
      next: (response) => {
        patchState(this, addEntities(response.data), {
          hasLoadedLikedRecipes: true,
          cursorLikedRecipes: response.cursor,
          likedRecipeIds: [
            ...this.likedRecipeIds(),
            ...response.data.map((recipe) => recipe.id),
          ],
        });
      },
      error: (err) => {
        patchState(this, { isLoading: false });
        console.error(err);
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  like(id: number, like: boolean) {
    const oldLike = this.entityMap()[id].liked;
    patchState(
      this,
      { isLoading: true },
      updateEntity({ id, changes: { liked: like } }),
    );
    this.service.like(id, like).subscribe({
      next: (recipe) => {
        patchState(this, updateEntity({ id, changes: recipe }));
        if (like) {
          const newLikedIds = [...this.likedRecipeIds(), recipe.id];
          newLikedIds.sort((a, b) => a - b);
          patchState(this, {
            likedRecipeIds: newLikedIds,
          });
        } else {
          const newLikedIds = this.likedRecipeIds().filter(
            (id) => id !== recipe.id,
          );
          console.log(newLikedIds);
          patchState(this, {
            likedRecipeIds: newLikedIds,
          });
        }
      },
      error: (err) => {
        patchState(this, updateEntity({ id, changes: { liked: oldLike } }), {
          isLoading: false,
        });
        console.error(err);
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  createRecipe(payload: CreateRecipeRequest) {
    patchState(this, { isLoading: true, createRecipeError: null });
    this.service.createRecipe(payload).subscribe({
      complete: () => patchState(this, { isLoading: false }),
      error: (err) =>
        patchState(this, { createRecipeError: err.message, isLoading: false }),
    });
  }
}
