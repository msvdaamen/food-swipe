import { Measurement } from "./types/measurement.type";
import { CreateMeasurementRequest } from "./requests/create-measurement.request";
import { UpdateMeasurementRequest } from "./requests/update-measurement.request";
import { httpApi } from "@/common/api";

export class MeasurementApi {
  getAll(signal?: AbortSignal) {
    return httpApi.get<Measurement[]>(`/v1/measurements`, { signal });
  }

  create(payload: CreateMeasurementRequest) {
    return httpApi.post<Measurement>(`/v1/measurements`, payload);
  }

  update(id: number, payload: UpdateMeasurementRequest) {
    return httpApi.put<Measurement>(`/v1/measurements/${id}`, payload);
  }

  delete(id: number) {
    return httpApi.delete(`/v1/measurements/${id}`);
  }
}

export const measurementApi = new MeasurementApi();
