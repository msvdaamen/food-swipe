import type { Measurement } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export const getMeasurement = async (api: HttpClient, id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`);
  return response.json() as Promise<Measurement>;
};
