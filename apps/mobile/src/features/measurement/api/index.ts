import type { Measurement } from "@food-swipe/types";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMeasurement,
  deleteMeasurement,
  getMeasurement,
  getMeasurements,
  measurementKeys,
  updateMeasurement,
  type CreateMeasurementInput,
  type UpdateMeasurementInput,
} from "@food-swipe/client-api/measurement";
import { useApiClient } from "@/lib/api-client-context";

export { measurementKeys, type CreateMeasurementInput, type UpdateMeasurementInput };

export const getMeasurementsQueryOptions = (api: Parameters<typeof getMeasurements>[0]) =>
  queryOptions({
    queryKey: measurementKeys.list(),
    queryFn: () => getMeasurements(api),
  });

export const useMeasurements = () => {
  const api = useApiClient();
  return useQuery(getMeasurementsQueryOptions(api));
};

export const getMeasurementQueryOptions = (api: Parameters<typeof getMeasurement>[0], id: number) =>
  queryOptions({
    queryKey: measurementKeys.detail(id),
    queryFn: () => getMeasurement(api, id),
  });

export const useMeasurement = (id: number) => {
  const api = useApiClient();
  return useQuery(getMeasurementQueryOptions(api, id));
};

export const useCreateMeasurement = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeasurementInput) => createMeasurement(api, payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>({ queryKey: measurementKeys.list() }, (old) => [
        ...(old ?? []),
        data,
      ]);
    },
  });
};

export const useDeleteMeasurement = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMeasurement(api, id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: measurementKeys.list() },
        (old) => old?.filter((m) => m.id !== id),
      );
    },
  });
};

export const useUpdateMeasurement = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMeasurementInput) => updateMeasurement(api, payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: measurementKeys.list() },
        (old) => old?.map((m) => (m.id === data.id ? data : m)),
      );
    },
  });
};
