import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { measurementKeys } from "../keys";

export const deleteMeasurement = async (api: AuthApiClient, id: number) => {
  const response = await api.fetch(`/v1/measurements/${id}`, {
    method: "DELETE",
  });
  return response.json() as Promise<Measurement>;
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
