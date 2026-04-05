import type { Measurement } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { measurementKeys } from "../keys";

export type UpdateMeasurementInput = {
  measurementId: number;
  data: {
    name?: string;
    abbreviation?: string;
  };
};

export const updateMeasurement = async (api: AuthApiClient, payload: UpdateMeasurementInput) => {
  const response = await api.fetch(`/v1/measurements/${payload.measurementId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<Measurement>;
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
