import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeasurement, type CreateMeasurementInput } from "@food-swipe/client-api/measurement";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";

export { type CreateMeasurementInput };

export const useCreateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeasurementInput) => createMeasurement(api, payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: getMeasurementsQueryOptions().queryKey },
        (old) => [...(old ?? []), data]
      );
    }
  });
};
