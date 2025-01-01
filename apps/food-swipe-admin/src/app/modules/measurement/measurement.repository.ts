import { computed, inject, Injectable } from '@angular/core';
import { MeasurementStore } from './stores/measurement.store';
import { CreateMeasurementRequest } from './requests/create-measurement.request';
import { UpdateMeasurementRequest } from './requests/update-measurement.request';

@Injectable({ providedIn: 'root' })
export class MeasurementRepository {
  private readonly measurementStore = inject(MeasurementStore);

  measurements = this.measurementStore.entities;
  entityMap = this.measurementStore.entityMap;

  get(id: number) {
    return computed(() => this.entityMap()[id]);
  }

  loadAll() {
    this.measurementStore.loadAll();
  }

  create(measurement: CreateMeasurementRequest) {
    this.measurementStore.create(measurement);
  }

  update(id: number, measurement: UpdateMeasurementRequest) {
    this.measurementStore.update(id, measurement);
  }

  delete(id: number) {
    this.measurementStore.delete(id);
  }
}
