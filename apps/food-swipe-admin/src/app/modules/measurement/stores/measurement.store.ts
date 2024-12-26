import { inject, Injectable } from '@angular/core';
import { Measurement } from '../types/measurement.type';
import {
  addEntity,
  removeEntity,
  setEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { MeasurementService } from '../measurement.service';
import { CreateMeasurementRequest } from '../requests/create-measurement.request';
import { UpdateMeasurementRequest } from '../requests/update-measurement.request';

type State = {
  isLoading: boolean;
  hasLoaded: boolean;
};

const initialState: State = {
  isLoading: false,
  hasLoaded: false,
};

@Injectable({ providedIn: 'root' })
export class MeasurementStore extends signalStore(
  { protectedState: false },
  withState(initialState),
  withEntities<Measurement>(),
) {
  private readonly measurementService = inject(MeasurementService);

  loadAll() {
    patchState(this, { isLoading: true });
    this.measurementService.getAll().subscribe({
      next: (measurements) => {
        patchState(
          this,
          { hasLoaded: true, isLoading: false },
          setEntities(measurements),
        );
      },
      error: () => {
        patchState(this, { hasLoaded: true, isLoading: false });
      },
    });
  }

  create(measurement: CreateMeasurementRequest) {
    patchState(this, { isLoading: true });
    this.measurementService.create(measurement).subscribe({
      next: (createdMeasurement) => {
        patchState(this, setEntity(createdMeasurement));
      },
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  update(id: number, measurement: UpdateMeasurementRequest) {
    const previous = this.entityMap()[id];
    const preChange = {
      ...previous,
      ...measurement,
    };
    patchState(
      this,
      { isLoading: true },
      updateEntity({ id, changes: preChange }),
    );
    this.measurementService.update(id, measurement).subscribe({
      next: (measurement) =>
        patchState(this, updateEntity({ id, changes: measurement })),
      error: () => patchState(this, updateEntity({ id, changes: previous })),
      complete: () => patchState(this, { isLoading: false }),
    });
  }

  delete(id: number) {
    const previous = this.entityMap()[id];
    patchState(this, { isLoading: true }, removeEntity(id));
    this.measurementService.delete(id).subscribe({
      next: () => patchState(this, removeEntity(id)),
      error: () => patchState(this, addEntity(previous)),
      complete: () => patchState(this, { isLoading: false }),
    });
  }
}
