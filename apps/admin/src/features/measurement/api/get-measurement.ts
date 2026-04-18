import type { Measurement } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { measurementKeys } from "./keys";

export const getMeasurement = async (id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`);
  return response.json() as Promise<Measurement>;
};

export const getMeasurementQueryOptions = (id: number) =>
  queryOptions({
    queryKey: measurementKeys.detail(id),
    queryFn: () => getMeasurement(id),
  });

export const useMeasurement = (id: number) => {
  return useQuery(getMeasurementQueryOptions(id));
};
