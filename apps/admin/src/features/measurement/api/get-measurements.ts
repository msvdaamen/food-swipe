import { api } from "@/lib/api";
import { Measurement } from "../types/measurement.type";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { objectToSearchParams } from "@/lib/utils";
import { PaginatedData } from "@/types/paginated-data";

export type GetMeasurementsInput = {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page: number;
  limit: number;
};

export const getMeasurements = async (payload: GetMeasurementsInput) => {
  const params = objectToSearchParams(payload);

  const response = await api.fetch(`/v1/measurements?${params}`);
  return response.json() as Promise<PaginatedData<Measurement>>;
};

export const getMeasurementsQueryOptions = (payload: GetMeasurementsInput) => {
  return queryOptions({
    queryKey: ["measurements"],
    queryFn: () => getMeasurements(payload),
  });
};
export const useMeasurements = (payload: GetMeasurementsInput) =>
  useQuery(getMeasurementsQueryOptions(payload));
