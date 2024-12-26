import { Injectable } from '@angular/core';
import { Service } from '../../common/service';
import { Measurement } from './types/measurement.type';
import { CreateMeasurementRequest } from './requests/create-measurement.request';
import { UpdateMeasurementRequest } from './requests/update-measurement.request';

@Injectable({ providedIn: 'root' })
export class MeasurementService extends Service {
  getAll() {
    return this.http.get<Measurement[]>(`${this.api}/measurements`);
  }

  create(payload: CreateMeasurementRequest) {
    return this.http.post<Measurement>(`${this.api}/measurements`, payload);
  }

  update(id: number, payload: UpdateMeasurementRequest) {
    return this.http.put<Measurement>(
      `${this.api}/measurements/${id}`,
      payload,
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/measurements/${id}`);
  }
}
