import type { Measurement } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export type UpdateMeasurementInput = {
  measurementId: number;
  data: {
    name?: string;
    abbreviation?: string;
  };
};

export const updateMeasurement = async (api: HttpClient, payload: UpdateMeasurementInput) => {
  const response = await api.fetch(`/v1/measurements/${payload.measurementId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<Measurement>;
};
