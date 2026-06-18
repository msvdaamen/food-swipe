import type { Measurement } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export type CreateMeasurementInput = {
  name: string;
  abbreviation: string;
};

export const createMeasurement = async (api: HttpClient, payload: CreateMeasurementInput) => {
  const response = await api.fetch("/v1/measurements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<Measurement>;
};
