import type { Measurement } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { measurementKeys } from "../keys";

export const getMeasurements = async (api: AuthApiClient) => {
  const response = await api.fetch("/v1/measurements");
  return response.json() as Promise<Measurement[]>;
};

export const getMeasurementsQueryOptions = (api: AuthApiClient) =>
  queryOptions({
    queryKey: measurementKeys.list(),
    queryFn: () => getMeasurements(api),
  });

export const useMeasurements = () => {
  const api = useApiClient();
  return useQuery(getMeasurementsQueryOptions(api));
};
