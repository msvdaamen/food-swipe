import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  setEntity,
  updateEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { RecipeService } from '../recipe.service';
import { RecipeStep } from '../types/recipe-step.type';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CreateRecipeStepRequest } from '@modules/recipes/requests/create-recipe-step.request';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UpdateRecipeStepRequest } from '@modules/recipes/requests/update-recipe-step.request';
import { ReorderRecipeStepsRequest } from '@modules/recipes/requests/reorder-recipe-steps.request';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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
          setAllEntities(steps),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  createStep = rxMethod<{ recipeId: number; payload: CreateRecipeStepRequest }>(
    pipe(
      switchMap(({ recipeId, payload }) =>
        this.recipeService.createStep(recipeId, payload).pipe(
          tapResponse({
            next: (step) => patchState(this, setEntity(step)),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );

  updateStep = rxMethod<{
    recipeId: number;
    stepId: number;
    payload: UpdateRecipeStepRequest;
  }>(
    pipe(
      switchMap(({ recipeId, stepId, payload }) =>
        this.recipeService.updateStep(recipeId, stepId, payload).pipe(
          tapResponse({
            next: (step) =>
              patchState(this, updateEntity({ id: step.id, changes: step })),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );

  deleteStep = rxMethod<{ recipeId: number; stepId: number }>(
    pipe(
      switchMap(({ recipeId, stepId }) =>
        this.recipeService.deleteStep(recipeId, stepId).pipe(
          tapResponse({
            next: () => {
              const step = this.entityMap()[stepId];
              patchState(
                this,
                removeEntity(stepId),
                updateEntities({
                  predicate: (entity: RecipeStep) =>
                    entity.stepNumber > step.stepNumber,
                  changes: (entity: RecipeStep) => ({
                    stepNumber: entity.stepNumber - 1,
                  }),
                }),
              );
            },
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );

  reorderSteps = rxMethod<{
    recipeId: number;
    stepId: number;
    payload: ReorderRecipeStepsRequest;
  }>(
    pipe(
      tap(({ payload: { orderFrom, orderTo } }) => {
        const steps = [...this.entities()];
        moveItemInArray(steps, orderFrom - 1, orderTo - 1);
      }),
      switchMap(({ recipeId, stepId, payload }) =>
        this.recipeService.reorderSteps(recipeId, stepId, payload).pipe(
          tapResponse({
            next: (steps) => patchState(this, setAllEntities(steps)),
            error: (err) => console.error(err),
          }),
        ),
      ),
    ),
  );
}
