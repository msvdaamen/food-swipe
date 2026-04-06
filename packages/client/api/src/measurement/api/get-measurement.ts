import type { Measurement } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { measurementKeys } from "../keys";

export const getMeasurement = async (api: AuthApiClient, id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`);
  return response.json() as Promise<Measurement>;
};

export const getMeasurementQueryOptions = (api: AuthApiClient, id: number) =>
  queryOptions({
    queryKey: measurementKeys.detail(id),
    queryFn: () => getMeasurement(api, id),
  });

export const useMeasurement = (id: number) => {
  const api = useApiClient();
  return useQuery(getMeasurementQueryOptions(api, id));
};
