import type { Measurement } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export const getMeasurements = async (api: HttpClient) => {
  const response = await api.fetch("/v1/measurements");
  return response.json() as Promise<Measurement[]>;
};
