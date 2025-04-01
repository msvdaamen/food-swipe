import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { measurementApi } from "../measurement.api";
import { CreateMeasurementRequest } from "../requests/create-measurement.request";
import { UpdateMeasurementRequest } from "../requests/update-measurement.request";
import { Measurement } from "../types/measurement.type";

export function useMeasurements() {
  return useQuery({
    queryKey: ["measurements"],
    queryFn: () => measurementApi.getAll(),
  });
}

export function useCreateMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeasurementRequest) =>
      measurementApi.create(payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>(
        {
          queryKey: ["measurements"],
        },
        (old) => [...(old || []), data]
      );
    },
  });
}

export function useUpdateMeasurement(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMeasurementRequest) =>
      measurementApi.update(id, payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>(
        {
          queryKey: ["measurements"],
        },
        (old) =>
          old?.map((measurement) =>
            measurement.id === id ? data : measurement
          )
      );
    },
  });
}

export function useDeleteMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => measurementApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<Measurement[]>(
        {
          queryKey: ["measurements"],
        },
        (data) => data?.filter((measurement) => measurement.id !== id)
      );
    },
  });
}
