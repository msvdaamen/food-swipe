import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { measurementKeys } from "./keys";

export const deleteMeasurement = async (id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`, {
    method: "DELETE",
  });
  return response.json() as Promise<Measurement>;
};

export const useDeleteMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeasurement,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<Measurement[]>(
        { queryKey: measurementKeys.list() },
        (old) => old?.filter((m) => m.id !== id),
      );
    },
  });
};
