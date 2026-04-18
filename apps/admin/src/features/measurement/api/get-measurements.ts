import type { Measurement } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { measurementKeys } from "./keys";

export const getMeasurements = async () => {
  const response = await api.fetch("/v1/measurements");
  return response.json() as Promise<Measurement[]>;
};

export const getMeasurementsQueryOptions = () =>
  queryOptions({
    queryKey: measurementKeys.list(),
    queryFn: () => getMeasurements(),
  });

export const useMeasurements = () => {
  return useQuery(getMeasurementsQueryOptions());
};
