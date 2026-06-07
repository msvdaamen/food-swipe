import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMeasurements } from "@food-swipe/client-api/measurement";
import { api } from "@/lib/api";
import { measurementKeys } from "./measurement-keys";

export const getMeasurementsQueryOptions = () =>
  queryOptions({
    queryKey: measurementKeys.list(),
    queryFn: () => getMeasurements(api)
  });

export const useMeasurements = () => useQuery(getMeasurementsQueryOptions());
