import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMeasurement } from "@food-swipe/client-api/measurement";
import { api } from "@/lib/api";
import { measurementKeys } from "./measurement-keys";

export const getMeasurementQueryOptions = (id: number) =>
  queryOptions({
    queryKey: measurementKeys.detail(id),
    queryFn: () => getMeasurement(api, id)
  });

export const useMeasurement = (id: number) => useQuery(getMeasurementQueryOptions(id));
