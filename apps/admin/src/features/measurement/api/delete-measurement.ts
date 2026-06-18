import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeasurement } from "@food-swipe/client-api/measurement";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";

export const useDeleteMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMeasurement(api, id),
    onSuccess: (_, id) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: getMeasurementsQueryOptions().queryKey },
        (old) => old?.filter((m) => m.id !== id)
      );
    }
  });
};
