import type { Measurement } from "@food-swipe/types";
import type { HttpClient } from "../../client";

export const deleteMeasurement = async (api: HttpClient, id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`, {
    method: "DELETE",
  });
  return response.json() as Promise<Measurement>;
};
