import { inject, Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Ingredient } from '../types/ingredient.type';
import { IngredientService } from '../ingredient.service';
import { GetIngredientsRequest } from '../requests/get-ingredients.request';
import { UpdateIngredientRequest } from '../requests/update-ingredient.request';
import { CreateIngredientRequest } from '../requests/create-ingredient.request';
import { Pagination } from '../../../common/types/pagination';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
  activeRequest: GetIngredientsRequest | null;
  pagination: Pagination | null;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
  activeRequest: null,
  pagination: null,
};

@Injectable({ providedIn: 'root' })
export class IngredientStore extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<Ingredient>(),
) {
  private readonly ingredientService = inject(IngredientService);

  loadAll(payload: GetIngredientsRequest) {
    patchState(this, { isLoading: true });
    this.ingredientService.getAll(payload).subscribe({
      next: ({ data, pagination }) => {
        patchState(
          this,
          {
            hasLoaded: true,
            isLoading: false,
            activeRequest: payload,
            pagination,
          },
          setAllEntities(data),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  create(measurement: CreateIngredientRequest) {
    patchState(this, { isLoading: true });
    this.ingredientService.create(measurement).subscribe({
      next: () => {
        const activeRequest = this.activeRequest();
        if (activeRequest) {
          this.loadAll(activeRequest);
        }
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  update(id: number, ingredient: UpdateIngredientRequest) {
    const previous = this.entityMap()[id];
    const preChange = {
      ...previous,
      ...ingredient,
    };
    patchState(
      this,
      { isLoading: true },
      updateEntity({ id, changes: preChange }),
    );
    this.ingredientService.update(id, ingredient).subscribe({
      next: (ingredient) =>
        patchState(this, updateEntity({ id, changes: ingredient })),
      error: () => patchState(this, updateEntity({ id, changes: previous })),
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  delete(id: number) {
    const previous = this.entityMap()[id];
    patchState(this, { isLoading: true }, removeEntity(id));
    this.ingredientService.delete(id).subscribe({
      next: () => {
        const activeRequest = this.activeRequest();
        if (activeRequest) {
          this.loadAll(activeRequest);
        }
      },
      error: () => patchState(this, addEntity(previous)),
      complete: () => patchState(this, { isLoading: false }),
    });
  }
}
