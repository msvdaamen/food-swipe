import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeasurement, type UpdateMeasurementInput } from "@food-swipe/client-api/measurement";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";

export { type UpdateMeasurementInput };

export const useUpdateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMeasurementInput) => updateMeasurement(api, payload),
    onSuccess: (data) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: getMeasurementsQueryOptions().queryKey },
        (old) => old?.map((m) => (m.id === data.id ? data : m))
      );
    }
  });
};
